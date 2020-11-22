const constant = require('./constant');
const State = require('./State');

module.exports = class StateManager {
  constructor({user, state}) {
    this.user = user;
    this.states = [];
    this.push(state);
  }

  prepareState(state) {
    state.user = this.user;
    state.stateManager = this;
    return state;
  }

  replace(newState) {
    const state = this.prepareState(newState);
    this.states[this.states.length - 1] = state;
    if(state.onEnabled)
      state.onEnabled();
  }

  push(newState) {
    const state = this.prepareState(newState);
    this.states.push(state);
    if(state.onEnabled)
      state.onEnabled();
  }

  pop(size = 1) {
    for (let i = 0; i < size; ++i) {
      const state = this.states.pop();
      if (state.onDisabled)
        state.onDisabled();
    }
  }

  emit(event, ...args) {
    const state = this.states[this.states.length - 1];
    if (state && state.handlers[event]) {
      state.handlers[event](...args);
    }
  }
}
