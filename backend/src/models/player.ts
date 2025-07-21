"use strict";

import { DataTypes, Sequelize } from "sequelize";

const { Model } = require("sequelize");
module.exports = (sequelize: Sequelize) => {

  class Player extends Model {
    static associate(models: any) {
      Player.hasMany(models.TeamPlayer, {
        foreignKey: "player_id",
        as: "team_players",
      });
    }
  }

  Player.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
      },
      position: {
        type: DataTypes.ENUM("GK", "DEF", "MID", "ATT"),
        allowNull: false,
      },
      team_name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Player",
      tableName: "players",
      underscored: true,
      paranoid: true,
    }
  );

  return Player;
};
