const constant = require('../constant');
const State = require('../State');

module.exports = class WaitingState extends State {
  constructor() {
    super(constant.state.WAITING);
    this.onExecute(() => {
      const users = Object.values(this.room.users);
      this.start = this.start ?? Date.now();
      const now = Date.now();
      const turn = Math.floor((now - this.start) / 5000) % users.length;
      const countdown = (now - this.start) % 5000;
      console.log(`gaming state turn ${turn} ${countdown}`);
    });
  }
}
