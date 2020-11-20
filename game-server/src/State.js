class State {
  constructor(handleEvent) {
    this.handleEvent = handleEvent;
  }
  moveTo(stateName) {
    this.fsm.moveTo(stateName);
  }
}

module.exports = State;
