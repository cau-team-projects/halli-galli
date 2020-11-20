const State = require('./State');
const switchRoom = require('./switchRoom');
class ReadyState extends State {
  constructor() {
    super();
    this.on('button', (btn)) => {
      if (btn == 'X') {
        switchRoom(this.user, "WAITING_ROOM");
        this.user.socket.emit("STATE_CHANGED", "WAITING");
        this.moveTo("WAITING");
      } else {}
    }
  }
}

module.exports = ReadyState;