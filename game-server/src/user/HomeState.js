const constant = require('../constant');
const joinRoom = require('../joinRoom');
const leaveRoom = require('../leaveRoom');
const State = require('../State');
const WaitingState = require('./WaitingState');

module.exports = class HomeState extends State {
  constructor() {
    super(constant.state.HOME);

    this.on(constant.event.BUTTON_CLICKED, (button) => {
      console.log(`button ${button} clicked`);
      if (button == 'A' || button == 'B') {
        this.push(new WaitingState());
      }
    });

    this.onEnabled(() => {
      joinRoom(this.user, constant.room.HOME);
      this.user.socket.emit(constant.event.PAGE_CHANGED, constant.page.HOME);
    });

    this.onDisabled(() => {
      leaveRoom(this.user, constant.room.HOME);
    });
  }
}
