const State = require('./State');

class Fsm {
  constructor({user, states, initialStateName}) {
    this.user = user;
    this.states = states;
    for (const state of Object.values(this.states)) {
      state.user = this.user;
      state.fsm = this;
    }
    this.state = this.states[initialStateName];
  }
  moveTo(stateName) {
    this.state = this.states[stateName];
  }
  emit(event, ...args) {
    if (this.state && this.state.handlers[event])
      this.state.handlers[event](...args);
  }
}

module.exports = Fsm;
