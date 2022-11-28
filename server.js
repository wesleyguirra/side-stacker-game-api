const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors({origin: '*'}))
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const {findAvailableRoom, createRoom, disconnectPlayer} = require("./src/controllers/room");
const {createBoard, updateBoard, resetBoard} = require("./src/controllers/board");
const {checkWinner} = require("./src/helpers");
const io = new Server(server, {
  cors: {
    origin: "*"
  }
});

const port = process.env.PORT || 7777;

io.on('connection', async (socket) => {

  socket.on('find room', async (name) => {
    console.log('find room')
    const room = await findAvailableRoom(name, socket.id)
    if (!room) {
      return io.to(socket.id).emit('room not found')
    }
    io.to(socket.id).emit('room found', room)
    return io.to(room.player1).emit('player2 found', room)
  })

  socket.on('create room', async (data) => {
    const {name, boardSettings} = data
    const room = await createRoom(name, socket.id)
    if (!room) return io.emit('room already exists')
    io.to(socket.id).emit('room created', room)

    let board = await createBoard(room.id, boardSettings, socket.id)
    io.to(room.player1).emit('board created', board)
  })

  socket.on('make move', async (data) => {
    const {x, y, room: roomName} = data
    let {board, room} = await updateBoard(roomName, x, y, socket.id)

    const winner = board.checkWinner()
    if (!!winner) {
      board = await resetBoard(roomName)
      io.emit('game over', winner)
    }
    io.to(room.player1).emit('board updated', {board, room})
    io.to(room.player2).emit('board updated', {board, room})
    io.to(room.turn).emit('your turn')

  })

  socket.on('disconnect', async () => {
    await disconnectPlayer(socket.id)
  });
});

module.exports = server.listen(port, function() {
  console.log(`Listening at port: ${port}`);
});
