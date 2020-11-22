const StateManager = require('./StateManager');

module.exports = class Room {
  constructor({name, io, state, allUsers}) {
    this.name = name;
    this.io = io;
    this.stateManager = new StateManager({state});
    this.allUsers = allUsers;
  }
  get sockets() {
    return io.sockets.clients(this.name);
  }
  get users() {
    const users = {};
    Object
      .values(this.allUsers)
      .filter(user => this.name === user.room.name)
      .forEach(user => {users[user.id] = user.socket.id});
    return users;
  }
}
