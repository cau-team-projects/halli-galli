const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const ioc = require('socket.io-client');
const serialport = require('serialport');
const serialParser = new serialport.parsers.Readline('\r\n');
const config = require('./config');

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/static/index.html');
});

let user = null;
io.on('connection', (socket) => {
  if (io.engine.gamesCount > 1) {
    socket.emit('err', { message: 'Only one user can connect' })
    socket.disconnect()
  }

  user = socket;
  console.log('a user connected');

  // https://socket.io/docs/client-connection-lifecycle/
  const game = ioc(`http://localhost:4000`);
  game.on('connect', () => console.log('connected to game server'));
  game.on('connect_error', () => console.log('failed to connect to game server'));
  game.on('disconnect', () => console.log('disconnected from game server'));

  const sp = new serialport(config.SERIAL_PORT_PATH, {
    baudRate: config.SERIAL_PORT_BAUD_RATE,
  });
  sp.on('open', () => {})
  serialParser.on('data', (data) => {
    console.log('button clicked');
    game.emit('button', 0);
  });
  sp.pipe(serialParser);

  socket.on("disconnect", () => {
    console.info(`a user disconnected [id=${socket.id}]`);
    sp.close((err) => {
      if (err)
        console.log(`serial error: ${err}`);
    });
  });
});

http.listen(config.WS_PORT, () => {
  console.log('listening');
});

setInterval(() => {
  if (user)
    user.emit('test', Math.random());
}, 1000);
