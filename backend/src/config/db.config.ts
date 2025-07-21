import { Sequelize } from 'sequelize';
import { config } from './env.config';

export const sequelize = new Sequelize(
  config.db.name!,       // e.g., 'football-manager'
  config.db.user!,       // e.g., 'root'
  config.db.pass,        // can be empty string
  {
    host: config.db.host || 'localhost',
    dialect: 'mysql',
    logging: false,
  }
);
