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

    if (!!count) return Promise.reject('Room already exists')

    const room = await Room.create({
      name,
      player1: socketId,
      player2: null,
      turn: 1
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
        [sequelize.Op.or]: [
          {player1: null},
          {player2: null}
        ]
      },
      include: { model: Board }
    })

    console.log(room)

    if (room?.player2 === null) room.player2 = socketId
    else if (room?.player1 === null) room.player1 = socketId

    await room?.save()

    return Promise.resolve(room)
  } catch (e) {
    console.error(e)
    throw e
  }
}

exports.disconnectPlayer = async (socketId) => {
  try {
    const rooms = await Room.findAll({
      where: {
        [sequelize.Op.or]: [
          {player1: socketId},
          {player2: socketId}
        ]
      }
    })
    await Promise.resolve(Promise.all(rooms.map(room => room.removePlayer(socketId))))
  } catch (e) {
    console.error(e)
    throw e
  }
}