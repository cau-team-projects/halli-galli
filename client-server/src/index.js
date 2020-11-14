const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

const serialport = require('serialport');

const SERIAL_PORT_PATH = '/dev/ttyACM0';
const SERIAL_PORT_BAUD_RATE = 9600;

const serialParser = new serialport.parsers.Readline('\r\n');

const sp = new serialport(SERIAL_PORT_PATH, {
  baudRate: SERIAL_PORT_BAUD_RATE,
});

let user = null;

sp.on('open', () => {
  console.log('open');
})

serialParser.on('data', (data) => console.log(data));

sp.pipe(serialParser);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

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

http.listen(3000, () => {
  console.log('listening...');
});

setInterval(() => {
  if (user)
    user.emit('test', Math.random());
}, 1000);

