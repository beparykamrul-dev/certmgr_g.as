import type { AcmeIdentifier } from './acme-client-contract';
export function dnsIdentifier(value: string): AcmeIdentifier { const domain = value.trim().toLowerCase(); if (!domain || domain.length > 253) throw new Error('invalid_dns_identifier'); return { type: 'dns', value: domain }; }
