class HomeState extends State {
  constructor() {
    super();
    this.on('button', (btn)) => {
      if (btn == 'A' || btn == 'B') {
        switchRoom(this.user, "WAITING_ROOM");
        this.user.socket.emit("STATE_CHANGED", "WAITING");
        moveTo("WAITING");
      } else {}
    }
  }
}

module.exports = HomeState;