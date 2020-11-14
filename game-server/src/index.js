const express = require('express');
const http = require('http');
const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server);

const rooms = ['room1'];

io.on('connection', (socket) => { 

  console.log(`user ${socket.id} connected`);

  const room = rooms[0];
  socket.join(room);
  console.log(`user ${socket.id} joins room ${room}`);
  io.to(room).emit('join', socket.id);

  socket.on('button', (button) => {
    console.log(`button ${button} clicked`);
  });

  socket.on('disconnect', () => {
    console.log(`user ${socket.id} disconnected`);
    const room = rooms[0];
    socket.leave(room);
    console.log(`user ${socket.id} leaves room ${room}`);
    io.to(room).emit('leave', socket.id);
  });
});

server.listen(4000, () => {
  console.log('listening');
});
