const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors({origin: '*'}))
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const {findAvailableRoom, createRoom, disconnectPlayer, } = require("./src/controllers/room");
const {createBoard, updateBoard, resetBoard, aiMove} = require("./src/controllers/board");
const {checkWinner} = require("./src/helpers");
const io = new Server(server, {
  cors: {
    origin: "*"
  }
});

const port = process.env.PORT || 7777;

io.on('connection', async (socket) => {

  socket.on('find room', async (name) => {
    let playerToNotify;
    const room = await findAvailableRoom(name, socket.id)
    if (!room) {
      return io.to(socket.id).emit('room not found')
    }
    io.to(socket.id).emit('room found', room)
    if (room.player1 === socket.id) playerToNotify = room.player2
    else if (room.player2 === socket.id) playerToNotify = room.player1
    return io.to(playerToNotify).emit('new player joined', room)
  })

  socket.on('create room', async (data) => {
    try {
      const {name, boardSettings} = data
      const room = await createRoom(name, socket.id)
      io.to(socket.id).emit('room created', room)
      let board = await createBoard(room.id, boardSettings, socket.id)
      io.to(room.player1).emit('board created', board)
    } catch (e) {
      io.emit(e.message)
    }
  })

  socket.on('make move', async (data) => {
    const {x, y, room: roomName} = data
    let {board, room} = await updateBoard(roomName, x, y, socket.id)
    const winner = board.checkWinner()
    if (!!winner) {
      board = await resetBoard(roomName)
      io.to(room.player1).emit('board updated', {board, room})
      io.to(room.player2).emit('board updated', {board, room})
      return io.emit('game over', winner)
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
