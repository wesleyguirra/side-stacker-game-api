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
    turn: DataTypes.INTEGER,
    player1: {
      type: DataTypes.STRING,
      allowNull: true
    },
    player2: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Room',
  });
  
  Room.afterSave(async (room) => {
    if(room.player1 === null && room.player2 === null) await room.destroy()
  })

  Room.prototype.alternateTurns = function() {
    switch (this.turn) {
      case 1:
        this.turn = 2
        break
      case 2:
        this.turn = 1
        break
      default:
        this.turn = null
    }
    return this.turn
  }

  Room.prototype.removePlayer = async function(player) {
    if (this.player1 === player) this.player1 = null
    if (this.player2 === player) this.player2 = null
    const result = await this.save()
    return Promise.resolve(result)
  }

  Room.prototype.getPlayerNumber = function(socketId) {
    switch (socketId) {
      case this.player1:
        return 1
      case this.player2:
        return 2
      default:
        return null
    }
  }

  Room.prototype.isPlayerTurn = function(player) {
    return this.turn === this.getPlayerNumber(player)
  }


  Room.prototype.isSinglePlayer = function() {
    return !this.player2
  }

  return Room;
};