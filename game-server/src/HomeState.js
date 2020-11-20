const State = require('./State');
class HomeState extends State {
  constructor() {
    super();
    this.on('button', (btn) => {
      console.log(`button ${btn} clicked`);
      if (btn == 'A' || btn == 'B') {
        switchRoom(this.user, "WAITING_ROOM");
        this.user.socket.emit("STATE_CHANGED", "WAITING");
        moveTo("WAITING");
      }
    })
  }
}

module.exports = HomeState;
