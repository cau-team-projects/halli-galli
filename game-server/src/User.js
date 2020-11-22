module.exports = class User {
  constructor({socket, io, rooms, stateManager}) {
    this.socket = socket;
    this.io = io;
    this.rooms = rooms;
    this.stateManager = stateManager;
  }
}
