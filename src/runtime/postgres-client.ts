export type SqlResult<T = unknown> = { rows: T[]; rowCount?: number | null };
export type SqlClient = {
  query<T = unknown>(text: string, values?: readonly unknown[]): Promise<SqlResult<T>>;
};

export function databaseConfigured(env: NodeJS.ProcessEnv = process.env): boolean {
  return Boolean(env.DATABASE_URL?.trim());
}
