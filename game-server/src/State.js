class State {
  constructor() {
    this.handlers = {};
  }
  moveTo(stateName) {
    this.fsm.moveTo(stateName);
  }
  on(event, handler) {
    this.handlers[event] = handler;
  }
}

module.exports = State;
