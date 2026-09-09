export interface RuntimeConfig { nodeEnv: 'development' | 'test' | 'production'; port: number; apiTokenConfigured: boolean; databaseConfigured: boolean; aiConfigured: boolean; }

export interface FeatureAvailability { feature: string; configured: boolean; source?: string; reason?: string; }
