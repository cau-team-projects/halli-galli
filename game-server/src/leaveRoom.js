const constant = require('./constant');

function leaveRoom(user) {
  const oldRoom = user.room;
  if (oldRoom) {
    user.socket.leave(oldRoom)
    user.io.to(oldRoom).emit(constant.event.ROOM_LEFT, user.socket.id);
    console.log(`user ${user.socket.id} leaves room ${oldRoom}`);
  }
}

module.exports = leaveRoom;
