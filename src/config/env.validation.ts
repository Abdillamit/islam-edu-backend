import * as Joi from 'joi';

export const envValidationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'test', 'production')
    .default('development'),
  PORT: Joi.number().default(3000),
  DATABASE_URL: Joi.string()
    .uri({ scheme: ['postgres', 'postgresql'] })
    .default(
      'postgresql://postgres:postgres@localhost:5432/islam_edu?schema=public',
    ),
  JWT_SECRET: Joi.string()
    .min(24)
    .default('replace-this-with-strong-jwt-secret'),
  JWT_EXPIRES_IN: Joi.string().default('7d'),
  ADMIN_SEED_EMAIL: Joi.string().email().default('admin@islamedu.kg'),
  ADMIN_SEED_PASSWORD: Joi.string().min(8).default('Admin123!'),
});
