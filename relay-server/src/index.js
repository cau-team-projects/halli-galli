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

function registerEvents(user) {
  user.socket.on(constant.event.USER_DISCONNECTED, (id) => {
    user.socket.emit(constant.event.USER_DISCONNECTED, id);
  });

  user.socket.on(constant.event.STATE_CHANGED, (state) => {
    user.socket.emit(constant.event.STATE_CHANGED, state);
  });

  user.socket.on(constant.event.ROOM_JOINED, (id) => {
    user.socket.emit(constant.event.ROOM_JOINED, id);
  });

  user.socket.on(constant.event.ROOM_LEFT, (id) => {
    user.socket.emit(constant.event.ROOM_LEFT, id);
  });
  user.socket.on("disconnect", () => {
    console.info(`user ${user.socket.id} disconnected`);
    if (user.sp)
      user.sp.close((err) => {});
  });
}

let user = null;
io.on('connection', (socket) => {
  console.log(io.engine.clientsCount);
  if (io.engine.clientsCount > 1) {
    socket.emit('err', { message: 'only one user can connect' })
    socket.disconnect()
  }

  // https://socket.io/docs/client-connection-lifecycle/
  const game = ioc(`http://localhost:4000`, { forceNew: true });

  user = {socket, io, game};

  game.on('connect', () => {
    console.log('connected to game server')
    const sp = new serialport(config.SERIAL_PORT_PATH, {
      baudRate: config.SERIAL_PORT_BAUD_RATE,
    });
    user.sp = sp;
    sp.on('open', () => {})
    serialParser.on('data', (button) => {
      console.log(`button ${button} clicked`);
      game.emit('button', button);
    });
    sp.on('error', () => {})
    sp.pipe(serialParser);

    game.on('disconnect', () => {
      console.log('disconnected from game server')
      sp.close((err) => {});
    });
  });
  game.on('connect_error', () => console.log('failed to connect to game server'));

  console.log('a user connected');
  registerEvents(user);
});

http.listen(config.WS_RELAY_PORT, () => {
  console.log('listening');
});

setInterval(() => {
  if (user)
    user.socket.emit('test', Math.random());
}, 1000);
