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
    const oldState = this.states[this.states.length - 1];

    this.states[this.states.length - 1] = state;

    if (oldState.onDestroyed)
      oldState.onDestroyed();
    if (oldState.onDisabled)
      oldState.onDisable();
    if (state.onEnabled)
      state.onEnabled();
  }

  push(newState) {
    const state = this.prepareState(newState);
    const oldState = this.states[this.states.length - 1];

    this.states.push(state);

    if (oldState.onDisabled)
      oldState.onDisabled();
    if (state.onEnabled)
      state.onEnabled();
  }

  pop(size = 1) {
    for (let i = 0; i < size; ++i) {
      const state = this.states.pop();

      if (oldState.onDestroyed)
        oldState.onDestroyed();
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
