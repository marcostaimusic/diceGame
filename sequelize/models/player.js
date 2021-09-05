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
        len: [2, 10]
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