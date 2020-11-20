const State = require('./State');

class Fsm {
  constructor({states, initialStateName}) {
    this.states = states;
    for (const state of Object.values(this.states))
      state.fsm = this;
    this.state = this.states[initialStateName];
  }
  moveTo(stateName) {
    this.state = states[stateName];
  }
  emit(event, ...args) {
    this.state.handleEvent(event, ...args);
  }
}

module.exports = Fsm;
