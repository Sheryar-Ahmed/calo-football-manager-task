import fs from "fs";
import path from "path";
import { Sequelize, DataTypes, Dialect } from "sequelize";
import { config as appConfig } from "../config/env.config";

const basename = path.basename(__filename);

const sequelizeConfig = {
  username: appConfig.db.user,
  password: appConfig.db.pass,
  database: appConfig.db.name,
  host: appConfig.db.host,
  dialect: "mysql" as Dialect,
  logging: false,
  define: {
    timestamps: true,
    paranoid: true,
    underscored: true,
  },
};

const sequelize = new Sequelize(
  sequelizeConfig.database,
  sequelizeConfig.username,
  sequelizeConfig.password,
  sequelizeConfig
);

const db: any = {};

// top-level IIFE for async/await
(async () => {
  const modelFiles = fs
    .readdirSync(__dirname)
    .filter(
      (file) =>
        file.indexOf(".") !== 0 &&
        file !== basename &&
        file.endsWith(".ts") &&
        !file.endsWith(".test.ts")
    );

  for (const file of modelFiles) {
    const modelModule = await import(path.join(__dirname, file));
    const model = modelModule.default(sequelize, DataTypes);
    db[model.name] = model;
  }

  // Run associations after all models are registered
  Object.keys(db).forEach((modelName) => {
    if (db[modelName].associate) {
      db[modelName].associate(db);
    }
  });
})();


// Associate models
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
