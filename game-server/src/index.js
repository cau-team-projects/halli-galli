const { v4: uuid } = require('uuid');
const express = require('express');
const http = require('http');
const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server);

const constant = require('./constant');
const config = require('./config');
const joinRoom = require('./joinRoom');
const leaveRoom = require('./leaveRoom');
const Room = require('./Room');
const User = require('./User');
const UserHomeState = require('./user/HomeState');

const users = {};
const rooms = {
  [constant.room.HOME]: new Room({name: constant.room.HOME, io, stateManager: null}),
  'GAME': new Room({name: 'GAME', io, stateManager: null})
};

io.on('connection', (socket) => { 

  console.log(`user ${socket.id} connected`);
  const user = new User({socket, io, rooms, state: new UserHomeState()});
  users[socket.id] = user;

  console.log(users)

  socket.on('button', (button) => {
    user.stateManager.emit(constant.event.BUTTON_CLICKED, button);
  });

  socket.on('disconnect', () => {
    console.log(`user ${socket.id} disconnected`);
    user.stateManager.popAll();
    delete users[socket.id];
  });
});

server.listen(config.WS_GAME_PORT, () => {
  console.log('listening');
});
