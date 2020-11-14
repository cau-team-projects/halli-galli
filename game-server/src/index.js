const express = require('express');
const http = require('http');
const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server);

const HOME_ROOM = 'home';
const WAITING_ROOM = 'waiting';
const GAMING_ROOM = 'gaming';
const users = {}

function switchRoom(socket, newRoom) {
  const user = users[socket.id];
  const oldRoom = user.room;
  if (oldRoom) {
    socket.leave(oldRoom)
    io.to(oldRoom).emit('leave', socket.id);
    console.log(`user ${socket.id} leaves room ${oldRoom}`);
  }
  user.room = newRoom;
  socket.join(newRoom);
  io.to(newRoom).emit('join', socket.id);
  console.log(`user ${socket.id} joins room ${newRoom}`);
}

io.on('connection', (socket) => { 

  console.log(`user ${socket.id} connected`);
  users[socket.id] = {};

  switchRoom(socket, HOME_ROOM)

  console.log(users)

  socket.on('button', (button) => {
    console.log(`button ${button} clicked`);
    const user = users[socket.id];
    if (user.room == HOME_ROOM) { /* DO SOMETHING */ }
  });

  socket.on('disconnect', () => {
    console.log(`user ${socket.id} disconnected`);
    const user = users[socket.id];
    const room = user.room;
    socket.leave(room);
    console.log(`user ${socket.id} leaves room ${room}`);
    io.to(room).emit('leave', socket.id);
    delete users[socket.id];
  });
});

server.listen(4000, () => {
  console.log('listening');
});
