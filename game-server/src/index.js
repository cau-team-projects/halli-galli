const express = require('express');
const http = require('http');
const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server);
const config = require('./config');
const State = require('./State');
const HomeState = require('./HomeState');
//const WaitingState = require('./WaitingState');
//const ReadyState = require('./ReadyState');
//const MyTurnState = require('./MyTurnState');
//const NotMyTurnState = require('./NotMyTurnState');
const Fsm = require('./Fsm');

const HOME_ROOM = 'home';
const WAITING_ROOM = 'waiting';
const GAMING_ROOM = 'gaming';

const users = {}

function switchRoom(user, newRoom) {
  const oldRoom = user.room;
  if (oldRoom) {
    user.socket.leave(oldRoom)
    user.io.to(oldRoom).emit('leave', socket.id);
    console.log(`user ${socket.id} leaves room ${oldRoom}`);
  }
  user.room = newRoom;
  user.socket.join(newRoom);
  io.to(newRoom).emit('join', user.socket.id);
  console.log(`user ${user.socket.id} joins room ${newRoom}`);
}

io.on('connection', (socket) => { 

  console.log(`user ${socket.id} connected`);
  const user = {socket, io};
  user.fsm = new Fsm({
    user,
    states: {
      HOME: new HomeState(),
      //WAITING: new WaitingState(),
      //READY: new ReadyState(),
      //MY_TURN: new MyTurnState(),
      //NOT_MY_TURN: new NotMyTurnState()
    },
    initialStateName: 'HOME'
  });
  users[socket.id] = user;

  switchRoom(user, HOME_ROOM)

  console.log(users)

  socket.on('button', (button) => {
    user.fsm.emit('button', button);
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

server.listen(config.WS_GAME_PORT, () => {
  console.log('listening');
});
