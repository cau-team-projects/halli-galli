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

  if (io.engine.clientsCount > 1) {
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
  console.log(client.connected)

}, 1000);


// https://socket.io/docs/client-connection-lifecycle/
const client = ioc(`http://localhost:4000`, {
  reconnection: true,
});
function handleError(client, err) {
  client.on(err, (msg) => console.log(err, msg))
}
handleError(client, 'error')
handleError(client, 'connect_error')
handleError(client, 'connect_timeout')
handleError(client, 'reconnect_error')
handleError(client, 'reconnect_failed')
handleError(client, 'reconnecting')
handleError(client, 'reconnect_attempt')


client.on('connect', () => console.log('connected'))
client.on('disconnect', () => console.log('disconnected'))
