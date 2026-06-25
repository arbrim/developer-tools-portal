interface AppConfig {
  PORT?: string;
  MONGO_URI?: string;
  JWT_SECRET?: string;
  JWT_EXPIRES_IN?: string;
  CORS_ORIGIN?: string;
  SEED_ON_START?: string;
  ADMIN_EMAIL?: string;
  ADMIN_PASSWORD?: string;
  USER_EMAIL?: string;
  USER_PASSWORD?: string;
}

export function validateConfig(config: AppConfig) {
  const required = ['MONGO_URI', 'JWT_SECRET'] as const;
  const missing = required.filter((key) => !config[key]);

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }

  return {
    ...config,
    PORT: Number(config.PORT ?? 3000),
    JWT_EXPIRES_IN: config.JWT_EXPIRES_IN ?? '1h',
    SEED_ON_START: config.SEED_ON_START ?? 'true',
    ADMIN_EMAIL: config.ADMIN_EMAIL ?? 'admin@example.com',
    ADMIN_PASSWORD: config.ADMIN_PASSWORD ?? 'Admin123!',
    USER_EMAIL: config.USER_EMAIL ?? 'user@example.com',
    USER_PASSWORD: config.USER_PASSWORD ?? 'User123!',
  };
}
