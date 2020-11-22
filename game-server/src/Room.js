const constant = require('./constant');
const StateManager = require('./StateManager');

module.exports = class Room {
  constructor({name, io, state, allUsers}) {
    this.name = name;
    this.io = io;
    this.stateManager = new StateManager({state, room: this});
    this.allUsers = allUsers;
  }

  get sockets() {
    return io.sockets.clients(this.name);
  }

  get users() {
    const users = {};
    console.log('this.allUsers', this.allUsers);
    Object
      .values(this.allUsers)
      .filter(user => user.room.name === this.name)
      .forEach(user => {users[user.id] = user});
    return users;
  }

  emit(event, ...args) {
    this.io.to(this.name).emit(event, ...args);
  }

  leave(user) {
    user.room = null;
    user.socket.leave(this.name);
    user.socket.emit(constant.event.ROOM_LEFT, this.name);
    user.socket.to(this.name).emit(constant.event.USER_ROOM_LEFT, user.id, this.name);
    console.log(`user ${user.id} leaves room ${room.name}`);
  }

  join(user) {
    user.room = this;
    user.socket.join(this.name);
    user.socket.emit(constant.event.ROOM_JOINED, this.name);
    user.socket.to(this.name).emit(constant.event.USER_ROOM_JOINED, user.socket.id, this.name);
    console.log(`user ${user.socket.id} joins room ${this.name}`);
  }
}
