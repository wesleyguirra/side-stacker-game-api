const { Repository } = require('redis-om');
const {Board, Player, Room} = require("../models");
const {Sequelize, Op} = require("sequelize");
const sequelize = require("sequelize");

exports.createRoom = async (name, socketId) => {
  try {
    if (!name) {
      name = (Math.random() + 1).toString(36).substring(7)
    }

    const {count} = await Room.findAndCountAll({
      where: {
        name
      }
    })

    if (!!count) return

    const room = await Room.create({
      name,
      player1: socketId,
      player2: null,
      turn: socketId
    })

    return Promise.resolve(room)

  } catch (e) {
    console.error(e)
  }
}

/**
 * Find and assign a room to player2
 * @param name
 * @param socketId
 * @return {Promise<string>}
 */
exports.findAvailableRoom = async (name, socketId) => {
  try {
    const room = await Room.findOne({
      where: {
        name,
        player1: {
          [sequelize.Op.not]: socketId
        },
        player2: null
      },
      include: { model: Board }
    })

    room.player2 = socketId

    await room.save()

    return Promise.resolve(room)
  } catch (e) {
    console.error(e)
  }
}

exports.disconnectPlayer = async (socketId) => {
  try {
    await Room.destroy({
      where: {
        player1: socketId
      }
    })
    const rooms = await Room.findAll({
      where: {
        player2: socketId
      }
    })
    rooms.forEach(room => room.removePlayer)
    console.log(rooms)
  } catch (e) {
    console.error(e)
  }
}