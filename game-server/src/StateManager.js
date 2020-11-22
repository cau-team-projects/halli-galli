const constant = require('./constant');
const State = require('./State');

module.exports = class StateManager {
  constructor({user, room, state}) {
    this.user = user;
    this.room = room;
    this.states = [];
    if (state)
      this.push(state);
  }

  prepareState(state) {
    state.user = this.user;
    state.room = this.room;
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

  peek() {
    return this.states[this.states.length - 1];
  }

  push(newState) {
    const state = this.prepareState(newState);
    const oldState = this.states[this.states.length - 1];

    this.states.push(state);

    if (oldState && oldState.onDisabled)
      oldState.onDisabled();
    if (state.onEnabled)
      state.onEnabled();
  }

  pop(size = 1) {
    for (let i = 0; i < size; ++i) {
      const state = this.states.pop();

      if (state.onDestroyed)
        state.onDestroyed();
      if (state.onDisabled)
        state.onDisabled();
    }
  }

  popAll() {
    this.pop(this.states.length);
  }

  emit(event, ...args) {
    const state = this.peek();
    if (state && state.handlers[event]) {
      state.handlers[event](...args);
    }
  }

  execute() {
    const state = this.peek();
    if (state && state.onExecute)
      state.onExecute();
  }
}
