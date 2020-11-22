const constant = require('./constant');

function joinRoom(user, newRoom) {
  user.room = newRoom;
  // user.rooms[user.room]
  user.socket.join(newRoom);
  user.socket.emit(constant.event.ROOM_JOINED, newRoom);
  user.socket.to(newRoom).emit(constant.event.USER_ROOM_JOINED, user.socket.id, newRoom);
  console.log(`user ${user.socket.id} joins room ${newRoom}`);
}

module.exports = joinRoom;
