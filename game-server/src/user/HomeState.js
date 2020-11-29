const constant = require('../../../common/constant');
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
      this.user.rooms[constant.room.HOME].join(this.user);
      this.user.socket.emit(constant.event.PAGE_CHANGED, constant.page.HOME);
    });

    this.onDisabled(() => {
      this.user.rooms[constant.room.HOME].leave(this.user);
    });
  }
}
