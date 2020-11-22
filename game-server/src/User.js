const StateManager = require('./StateManager');

module.exports = class User {
  constructor({socket, io, rooms, state}) {
    this.socket = socket;
    this.io = io;
    this.rooms = rooms;
    this.stateManager = new StateManager({
      user: this,
      state
    })
  }
  get id() {
    return this.socket.id;
  }
}
