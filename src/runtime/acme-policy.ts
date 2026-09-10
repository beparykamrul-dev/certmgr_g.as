export type AcmePolicy = { allowWildcards: boolean; maxIdentifiers: number };
export const DEFAULT_ACME_POLICY: AcmePolicy = { allowWildcards: true, maxIdentifiers: 100 };
export function validateAcmeIdentifiers(ids: string[], policy = DEFAULT_ACME_POLICY): void { if (!ids.length || ids.length > policy.maxIdentifiers) throw new Error('acme_identifier_count_invalid'); if (!policy.allowWildcards && ids.some(id => id.startsWith('*.'))) throw new Error('acme_wildcard_not_allowed'); }
