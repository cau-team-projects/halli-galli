const StateManager = require('./StateManager');

module.exports = class Room {
  constructor({name, io, stateManager}) {
    this.name = name;
    this.io = io;
    this.stateManager = stateManager;
  }
  get sockets() {
    return io.sockets.clients(this.name);
  }
}
