import dotenv from 'dotenv';
dotenv.config();

import Joi from 'joi';

const envSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
  PORT: Joi.number().default(5000),
  DB_NAME: Joi.string().required(),
  DB_USER: Joi.string().required(),
  DB_PASS: Joi.string().allow('', null),
  DB_HOST: Joi.string().default('localhost'),
  JWT_SECRET: Joi.string().required(),
}).unknown();

const { value: envVars, error } = envSchema.validate(process.env);

if (error) {
  throw new Error(`❌ Env validation error: ${error.message}`);
}

export const config = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  db: {
    name: envVars.DB_NAME,
    user: envVars.DB_USER,
    pass: envVars.DB_PASS,
    host: envVars.DB_HOST,
  },
  jwt: {
    secret: envVars.JWT_SECRET,
  },
};
