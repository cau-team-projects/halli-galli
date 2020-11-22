const constant = require('./constant');
const express = require('express');
const http = require('http');
const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server);
const config = require('./config');
const HomeState = require('./HomeState');
const StateManager = require('./StateManager');

const users = {}

io.on('connection', (socket) => { 

  console.log(`user ${socket.id} connected`);
  const user = {socket, io};
  user.stateManager = new StateManager({
    user,
    state: new HomeState()
  });
  users[socket.id] = user;

  console.log(users)

  socket.on('button', (button) => {
    user.stateManager.emit(constant.event.BUTTON_CLICKED, button);
  });

  socket.on('disconnect', () => {
    console.log(`user ${socket.id} disconnected`);
    const user = users[socket.id];
    const room = user.room;
    socket.leave(room);
    console.log(`user ${socket.id} leaves room ${room}`);
    io.to(room).emit(constant.event.ROOM_LEFT, socket.id);
    delete users[socket.id];
  });
});

server.listen(config.WS_GAME_PORT, () => {
  console.log('listening');
});
