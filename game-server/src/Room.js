const StateManager = require('./StateManager');

module.exports = class Room {
  constructor({name, io, state}) {
    this.name = name;
    this.io = io;
    this.stateManager = new StateManager({state});
  }
  get sockets() {
    return io.sockets.clients(this.name);
  }
}
