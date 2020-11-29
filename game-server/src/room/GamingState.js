const constant = require('../constant');
const State = require('../State');

module.exports = class WaitingState extends State {
  constructor() {
    super(constant.state.WAITING);
    this.onExecute(() => {
      const users = Object.values(this.users);
      this.start = this.start ?? Date.now();
      const now = Date.now();
      const turn = Math.floor((now - this.start) / 5000) % this.users.length;
      console.log('gaming state');
    });
  }
}
