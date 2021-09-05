'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Game extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({Player}) {
      // define association here
      this.belongsTo(Player)
    }
  };
  Game.init({
    result: {
      type: DataTypes.BOOLEAN,
      // allowNull: false
    },
    dice1: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    dice2: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Game',
  });
  return Game;
};