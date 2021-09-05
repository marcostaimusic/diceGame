'use strict';
module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.createTable('Players', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      name: { 
        type: DataTypes.STRING,
        validate: {
          len: [2, 10]
        },
        defaultValue:'Anonim',
        allowNull: false
      },
      successRate: {
        type: DataTypes.FLOAT(5,4),
        defaultValue: 0
      },
      gamesCounter: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE
      }
    });
  },
  down: async (queryInterface, DataTypes) => {
    await queryInterface.dropTable('Players');
  }
};