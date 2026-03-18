export interface AppConfig {
  port: number;
  databaseUrl: string;
  jwtSecret: string;
  jwtExpiresIn: string;
  bcryptRounds: number;
  corsOrigin: string;
  nodeEnv: string;
}

function required(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

export function getConfig(): AppConfig {
  return {
    port: parseInt(process.env.API_PORT ?? "3001", 10),
    databaseUrl: process.env.DATABASE_URL ?? "file:./data/taskforge.db",
    jwtSecret: required("JWT_SECRET"),
    jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? "7d",
    bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS ?? "10", 10),
    corsOrigin: process.env.CORS_ORIGIN ?? "http://localhost:3000",
    nodeEnv: process.env.NODE_ENV ?? "development",
  };
}

let _config: AppConfig | null = null;

export function config(): AppConfig {
  if (!_config) {
    _config = getConfig();
  }
  return _config;
}
