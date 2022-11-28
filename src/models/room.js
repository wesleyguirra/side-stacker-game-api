'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Room extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Room.hasOne(models.Board)
    }
  }
  Room.init({
    name: DataTypes.STRING,
    turn: DataTypes.STRING,
    player1: DataTypes.STRING,
    player2: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Room',
  });

  Room.prototype.isPlayerTurn = function(player) {
    return this.turn === player
  }

  Room.prototype.alternateTurns = function() {
    if (this.turn === this.player1) this.turn = this.player2
    else this.turn = this.player1
    return this.turn
  }

  Room.prototype.removePlayer = async function(player) {
    if (this.player1 === player) this.player1 === null
    if (this.player2 === player) this.player2 === null
    await this.save()
  }
  return Room;
};