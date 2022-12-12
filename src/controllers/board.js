const boardSchema = require("../models/board");
const roomSchema = require("../models/room");
const {Board, Room, Player} = require("../models")
const {getRandomInRange} = require("../helpers");

/**
 *
 * @param room
 * @param boardSettings
 * @return {Promise<void>}
 */
exports.createBoard = async (room, boardSettings) => {
  try {
    let {rows, columns, score} = boardSettings
    rows = parseInt(rows)
    columns = parseInt(columns)
    score = parseInt(score)

    let values = Array.from([])
    for (let r = 0; r < rows; r++) {
      //Push a row
      values.push([])
      for (let c = 0; c < columns; c++) {
        //Push column
        values[r]?.push(null)
      }
    }

    return await Board.create({
      RoomId: room,
      rows,
      columns,
      score,
      values
    }, { include: Room })
  } catch (e) {
    console.error(e.message)
  }
}

exports.resetBoard = async (roomName) => {
  let room = await Room.findOne({
    where: {
      name: roomName
    },
  })
  let board = await Board.findOne({
    where: {
      RoomId: room.id
    }
  })
  let values = Array.from([])
  for (let r = 0; r < board.rows; r++) {
    //Push a row
    values.push([])
    for (let c = 0; c < board.columns; c++) {
      //Push column
      values[r]?.push(null)
    }
  }
  board.values = values
  board.changed('values', true)
  board = await board.save()
  return Promise.resolve(board)
}

exports.updateBoard = async (roomName, x, y, socketId) => {
  try {
    let room = await Room.findOne({
      where: {
        name: roomName
      },
    })
    let board = await Board.findOne({
      where: {
        RoomId: room.id
      }
    })
    if (!room.isPlayerTurn(socketId) && room.player2 !== null) return Promise.reject('Not your turn')
    room.turn = room.alternateTurns()
    room = await room.save()
    board.values = board.updateValues(x, y, room.getPlayerNumber(socketId))
    board.changed('values', true)
    board = await board.save()
    board.values = board.makeAIMove()
    board.changed('values', true)
    board = await board.save()
    return Promise.resolve({board, room})
  } catch (e) {
    return Promise.reject(e.message)
  }
}