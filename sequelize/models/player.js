'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Player extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({Game}) {
      // define association here
      this.hasMany(Game)
    }
  };
  Player.init({
    name: 
    { type: DataTypes.STRING,
      validate: {
        len: {args: [2, 255], msg: "The name should be between 2 and 255 characters long"}
      },
      defaultValue:'Anonim',
      allowNull: false
    },
    successRate: 
    { type: DataTypes.FLOAT(5,4),
    defaultValue: 0
    },
    gamesCounter:
    { type: DataTypes.INTEGER,
      defaultValue: 0 
    }
  }, {
    sequelize,
    modelName: 'Player',
  });
  return Player;
};