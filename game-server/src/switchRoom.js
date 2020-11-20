function switchRoom(user, newRoom) {
  const oldRoom = user.room;
  if (oldRoom) {
    user.socket.leave(oldRoom)
    user.io.to(oldRoom).emit('leave', user.socket.id);
    console.log(`user ${user.socket.id} leaves room ${oldRoom}`);
  }
  user.room = newRoom;
  user.socket.join(newRoom);
  user.io.to(newRoom).emit('join', user.socket.id);
  console.log(`user ${user.socket.id} joins room ${newRoom}`);
}

module.exports = switchRoom;
