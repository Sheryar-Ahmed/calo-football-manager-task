import { config as env } from './env.config';

export = {
  development: {
    username: env.db.user,
    password: env.db.pass,
    database: env.db.name,
    host: env.db.host,
    dialect: 'mysql',
    migrationStorageTableName: 'migrations',
  },
};
