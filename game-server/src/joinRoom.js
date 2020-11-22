const constant = require('./constant');

function joinRoom(user, newRoom) {
  user.room = newRoom;
  user.socket.join(newRoom);
  user.socket.emit(constant.event.ROOM_JOINED, user.socket.id);
  user.socket.to(newRoom).emit(constant.event.USER_ROOM_JOINED, user.socket.id);
  console.log(`user ${user.socket.id} joins room ${newRoom}`);
}

module.exports = joinRoom;
