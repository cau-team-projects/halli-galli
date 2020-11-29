const { v4: uuid } = require('uuid');
const express = require('express');
const http = require('http');
const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server);

const constant = require('../../common/constant');
const config = require('./config');
const Room = require('./Room');
const RoomWaitingState = require('./room/WaitingState');
const User = require('./User');
const UserHomeState = require('./user/HomeState');

const users = {};
const rooms = {
  [constant.room.HOME]: new Room({name: constant.room.HOME, io, state: null, allUsers: users}),
  'GAME': new Room({name: 'GAME', io, state: new RoomWaitingState(), allUsers: users})
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

function gameLoop() {
  for (room of Object.values(rooms)) {
    room.stateManager.execute();
  }
}

const interval = setInterval(gameLoop, 50);
// clearInterval(interval);

server.listen(config.WS_GAME_PORT, () => {
  console.log('listening');
});
