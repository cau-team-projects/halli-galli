const State = require('./State');
const switchRoom = require('./switchRoom');
class MyTurnState extends State {
  constructor() {
    super();
    this.on('button', (btn)) => {
      if (btn == 'A') {
        flip();
        this.user.socket.emit("STATE_CHANGED", "NOT_MY_TURN");
        this.moveTo("NOT_MY_TURN");
      } else if (btn == 'B') {
        ring();
      } else if (btn == 'X') {
        this.on('button', (btn)) => {
          this.user.socket.emit("EXIT_DIALOG");
          if (btn == 'A') {
            switchRoom(this.user, "HOME_ROOM");
            this.user.socket.emit("STATE_CHANGED", "HOME");
            this.moveTo("HOME");
          } else {}
        }
      }
    }
  }
}

module.exports = MyTurnState;