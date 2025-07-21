"use strict";

import { DataTypes, Sequelize } from "sequelize";

const { Model } = require("sequelize");
module.exports = (sequelize: Sequelize) => {
  class User extends Model {
    static associate(models: any) {
      //   User.belongsToMany(models.Player, {
      //     through: models.TeamPlayer,
      //     foreignKey: "user_id",
      //     otherKey: "player_id",
      //     as: "players",
      //   });
      User.hasOne(models.Team, {
        foreignKey: 'user_id',
        as: 'team',
      });
    }
  }

  User.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "User",
      tableName: "users",
      paranoid: true,
      underscored: true,
    }
  );

  return User;
};
