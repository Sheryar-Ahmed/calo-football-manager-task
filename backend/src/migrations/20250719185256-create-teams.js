'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('teams', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true,
        references: {
          model: 'users',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      budget: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 5000000.0,
      },
      is_ready: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      player_count: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: {
          min: 15,
          max: 25,
        },
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });

    // Add CHECK constraint for player_count range
    await queryInterface.sequelize.query(`
      ALTER TABLE teams
      ADD CONSTRAINT player_count_range
      CHECK (player_count BETWEEN 15 AND 25)
    `);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('teams');
  },
};
