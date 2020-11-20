const State = require('./State');
const switchRoom = require('./switchRoom');
class WaitingState extends State {
  constructor() {
    super();
    this.on('button', (btn) => {
      if (btn == 'A' || btn == 'B') {
        switchRoom(this.user, "READY_ROOM");
        this.user.socket.emit("STATE_CHANGED", "READY");
        this.moveTo("READY");
      } else if (btn == 'X') {
        this.on('button', (btn) => {
          this.user.socket.emit("EXIT_DIALOG");
          if (btn == 'A') {
            switchRoom(this.user, "HOME_ROOM");
            this.user.socket.emit("STATE_CHANGED", "HOME");
            this.moveTo("HOME");
          }
        });
      }
    });
  }
}

module.exports = WaitingState;
