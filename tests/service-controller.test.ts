import assert from 'node:assert/strict';
import test from 'node:test';
import { buildServiceCommand, executeApprovedServiceCommand } from '../src/runtime/service-controller';

test('service command carries approval identity', async () => {
  const command = buildServiceCommand('nginx', 'reload', 'operator', 'approval-1');
  assert.equal(command.service, 'nginx');
  assert.equal(command.action, 'reload');
  assert.equal(command.approvalId, 'approval-1');
});

test('service execution refuses missing approval id', async () => {
  const command = buildServiceCommand('nginx', 'reload', 'operator', '');
  const result = await executeApprovedServiceCommand({ execute: async () => ({ commandId: command.id, accepted: true, executed: true, reason: 'ok' }) }, command);
  assert.equal(result.executed, false);
  assert.equal(result.reason, 'approval_id_required');
});
