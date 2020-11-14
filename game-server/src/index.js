const express = require('express');
const http = require('http');
const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server);

io.on('connection', (socket) => { 
  socket.on('button', (btn) => {
    console.log(`button ${btn} clicked`);
  });
  console.log('connected!');
});

server.listen(4000, () => {
  console.log('listening');
});
