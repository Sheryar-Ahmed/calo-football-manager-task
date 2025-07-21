"use strict";

import { DataTypes, Sequelize } from "sequelize";

const { Model } = require("sequelize");
module.exports = (sequelize: Sequelize) => {

  class Team extends Model {
    static associate(models: any) {
      Team.belongsTo(models.User, {
        foreignKey: "user_id",
        as: "user",
      });
      Team.hasMany(models.TeamPlayer, {
        foreignKey: "team_id",
        as: "team_players",
      });
    }
  }

  Team.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
      },
      budget: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 5000000.0,
      },
      is_ready: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      player_count: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: {
            args: [15],
            msg: 'Team must be at least 15',
          },
          max: {
            args: [25],
            msg: 'Team must be at most 25',
          },
        },
      }
    },
    {
      sequelize,
      modelName: "Team",
      tableName: "teams",
      underscored: true,
      paranoid: true,
    }
  );

  return Team;
};
