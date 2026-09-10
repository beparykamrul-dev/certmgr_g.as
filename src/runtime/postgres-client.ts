export type SqlResult<T = unknown> = { rows: T[]; rowCount?: number | null };
export type SqlClient = {
  query<T = unknown>(text: string, values?: readonly unknown[]): Promise<SqlResult<T>>;
};

export function databaseConfigured(env: NodeJS.ProcessEnv = process.env): boolean {
  return Boolean(env.DATABASE_URL?.trim());
}

export async function withTransaction<T>(db: SqlClient, work: () => Promise<T>): Promise<T> {
  await db.query('BEGIN');
  try {
    const result = await work();
    await db.query('COMMIT');
    return result;
  } catch (error) {
    try { await db.query('ROLLBACK'); } catch { /* preserve the original failure */ }
    throw error;
  }
}
