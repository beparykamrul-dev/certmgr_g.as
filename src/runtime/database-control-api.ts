import type express from 'express';
import type { DatabaseControlService } from './database-control-service';

export function registerDatabaseControlRoutes(app: express.Application, service: DatabaseControlService, requireOperator: express.RequestHandler, actor: (req: express.Request) => string) {
  app.get('/api/database/targets', async (_req, res) => {
    const targets = service.listTargets();
    const summaries = await Promise.all(targets.filter(t => t.configured).map(async target => {
      try { const summary = await service.summary(target.id); return [target.id, summary] as const; }
      catch { return [target.id, { target, healthy: false, capabilities: [] }] as const; }
    }));
    const byId = new Map(summaries);
    res.json({ targets: targets.map(target => ({ ...target, ...(byId.get(target.id) ? { healthy: byId.get(target.id)!.healthy, latencyMs: byId.get(target.id)!.latencyMs, sizeBytes: byId.get(target.id)!.sizeBytes, version: byId.get(target.id)!.version } : {}) })) });
  });

  app.get('/api/database/:id/summary', async (req, res) => {
    try { res.json(await service.summary(req.params.id)); }
    catch (error) { res.status(404).json({ error: 'database_summary_unavailable', reason: error instanceof Error ? error.message : 'unknown_error' }); }
  });

  app.get('/api/database/:id/objects', async (req, res) => {
    try { res.json({ objects: await service.objects(req.params.id) }); }
    catch (error) { res.status(404).json({ error: 'database_objects_unavailable', reason: error instanceof Error ? error.message : 'unknown_error' }); }
  });

  app.post('/api/database/query', requireOperator, async (req, res) => {
    const targetId = typeof req.body?.targetId === 'string' ? req.body.targetId.trim() : '';
    const sql = typeof req.body?.sql === 'string' ? req.body.sql : '';
    const readOnly = req.body?.readOnly === true;
    if (!targetId || !sql || !readOnly) return res.status(400).json({ error: 'read_only_query_required' });
    try { res.json(await service.query({ targetId, sql, parameters: Array.isArray(req.body?.parameters) ? req.body.parameters : [], readOnly })); }
    catch (error) { res.status(400).json({ error: 'database_query_rejected', reason: error instanceof Error ? error.message : 'query_failed' }); }
  });

  app.post('/api/database/actions', requireOperator, async (req, res) => {
    const action = typeof req.body?.action === 'string' ? req.body.action.trim() : '';
    const target = typeof req.body?.target === 'string' ? req.body.target.trim() : '';
    if (!action || !target) return res.status(400).json({ error: 'action_and_target_required' });
    try { const approval = await service.requestAction(action, target, actor(req)); res.status(202).json({ success: false, error: 'approval_required', approval }); }
    catch (error) { res.status(400).json({ error: 'database_action_rejected', reason: error instanceof Error ? error.message : 'action_failed' }); }
  });
}
