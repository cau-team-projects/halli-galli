module.exports = class State {
  constructor(name) {
    this.name = name;
    this.handlers = {};
  }

  replace(state) {
    this.stateManager.replace(state);
  }

  push(state) {
    this.stateManager.push(state);
  }

  pop(size) {
    this.stateManager.pop(size);
  }

  on(event, handler) {
    this.handlers[event] = handler;
  }

  onExecute(handler) {
    this.onExecute = handler;
  }

  onEnabled(handler) {
    this.onEnabled = handler;
  }

  onDisabled(handler) {
    this.onDisabled = handler;
  }

  onDestroyed(handler) {
    this.onDestroyed = handler;
  }
}
