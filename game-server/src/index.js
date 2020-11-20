const express = require('express');
const http = require('http');
const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server);
const config = require('./config');
const State = require('./State');
const Fsm = require('./Fsm');

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
  const user = {socket: socket};
  user.fsm = new Fsm({
    states: {
      HOME: new State((event, ...args) => {
        console.log(`I am home and button ${args[0]} is clicked`);
        // user, event, args, io
      }),
      WAITING: new State(() => {
      }),
      READY: new State(() => {
      }),
      MY_TURN: new State(() => {
      }),
      NOT_MY_TURN: new State(() => {
      })
    },
    initialStateName: 'HOME'
  });
  users[socket.id] = user;

  switchRoom(socket, HOME_ROOM)

  console.log(users)

  socket.on('button', (button) => {
    console.log(`button ${button} clicked`);
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
