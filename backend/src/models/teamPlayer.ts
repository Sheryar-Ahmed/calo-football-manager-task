"use strict";

import { DataTypes, Sequelize } from "sequelize";

const { Model } = require("sequelize");
module.exports = (sequelize: Sequelize) => {

  class TeamPlayer extends Model {
    static associate(models: any) {
      TeamPlayer.belongsTo(models.Team, {
        foreignKey: "team_id",
        as: "team",
      });
      TeamPlayer.belongsTo(models.Player, {
        foreignKey: "player_id",
        as: "player",
      });
    }
  }

  TeamPlayer.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      team_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      player_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      in_transfer_market: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      asking_price: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "TeamPlayer",
      tableName: "team_players",
      underscored: true,
      paranoid: true,
      indexes: [
        {
          unique: true,
          fields: ["team_id", "player_id"],
        },
      ],
    }
  );

  return TeamPlayer;
};
