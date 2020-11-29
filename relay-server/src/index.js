const constant = require('./constant');
const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const ioc = require('socket.io-client');
const serialport = require('serialport');
const serialParser = new serialport.parsers.Readline('\r\n');
const config = require('./config');

app.use('/static', express.static(__dirname + '/static'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/static/index.html');
});

function registerEvents(game, user) {
  [
    constant.event.PAGE_CHANGED,
    constant.event.ROOM_JOINED,
    constant.event.ROOM_LEFT,
    constant.event.USER_ROOM_JOINED,
    constant.event.USER_ROOM_LEFT,
    constant.event.WAITING_ROOM_USERS,
  ].forEach((event) => {
    game.on(event, (...args) => {
      console.log(event, args);
      user.socket.emit(event, ...args);
    });
  });

  user.socket.on("disconnect", () => {
    console.log(`user ${user.socket.id} disconnected`);
    user.socket.emit(constant.event.RELAY_DISCONNECTED);
    if (user.sp)
      user.sp.close((err) => {});
  });
}

let user = null;
io.on('connection', (socket) => {
  console.log(io.engine.clientsCount);
  if (io.engine.clientsCount > 1) {
    socket.emit(constant.event.RELAY_ERROR, 'only one user can connect')
    socket.disconnect()
  }

  // https://socket.io/docs/client-connection-lifecycle/
  const game = ioc(`${config.WS_GAME_ADDR}:${config.WS_GAME_PORT}`, { forceNew: true });

  user = {socket, io, game};

  user.socket.emit(constant.event.RELAY_CONNECTED);

  game.on('connect', () => {
    console.log('connected to game server')
    user.socket.emit(constant.event.GAME_CONNECTED);
    const sp = new serialport(config.SERIAL_PORT_PATH, {
      baudRate: config.SERIAL_PORT_BAUD_RATE,
    });
    user.sp = sp;
    sp.on('open', () => {})
    serialParser.on('data', (button) => {
      console.log(`button ${button} clicked`);
      game.emit('button', button);
    });
    sp.on('error', () => {
      console.log('error opening serial port');
    })
    sp.pipe(serialParser);

    game.on('disconnect', () => {
      console.log('disconnected from game server')
      user.socket.emit(constant.event.GAME_DISCONNECTED);
      sp.close((err) => {});
    });
  });
  game.on('connect_error', () => console.log('failed to connect to game server'));

  registerEvents(game, user);
});

http.listen(config.WS_RELAY_PORT, () => {
  console.log('listening');
});

setInterval(() => {
  if (user)
    user.socket.emit('test', Math.random());
}, 1000);
