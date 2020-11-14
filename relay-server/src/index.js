const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const ioc = require('socket.io-client');
const serialport = require('serialport');
const serialParser = new serialport.parsers.Readline('\r\n');
const config = require('./config');

const sp = new serialport(config.SERIAL_PORT_PATH, {
  baudRate: config.SERIAL_PORT_BAUD_RATE,
});

sp.on('open', () => {
  console.log('serial open');
})

serialParser.on('data', (data) => console.log(data));

sp.pipe(serialParser);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/static/index.html');
});

let user = null;

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on("disconnect", () => {
    console.info(`a user disconnected [id=${socket.id}]`);
  });

  if (io.engine.gamesCount > 1) {
    socket.emit('err', { message: 'Only one user can connect' })
    socket.disconnect()
  }

  user = socket;
});

http.listen(config.WS_PORT, () => {
  console.log('listening...');
});

setInterval(() => {
  if (user)
    user.emit('test', Math.random());
  console.log(game.connected)

}, 1000);


// https://socket.io/docs/game-connection-lifecycle/
const game = ioc(`http://localhost:4000`, {
  reconnection: true,
});
function handleError(game, err) {
  game.on(err, (msg) => console.log(err, msg))
}
handleError(game, 'error')
handleError(game, 'connect_error')
handleError(game, 'connect_timeout')
handleError(game, 'reconnect_error')
handleError(game, 'reconnect_failed')
handleError(game, 'reconnecting')
handleError(game, 'reconnect_attempt')


game.on('connect', () => console.log('connected'))
game.on('disconnect', () => console.log('disconnected'))
