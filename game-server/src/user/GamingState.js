const constant = require('../constant');
const State = require('../State');

module.exports = class GamingState extends State {
  constructor() {
    super(constant.state.GAMING);
    this.on(constant.event.BUTTON_CLICKED, (button) => {
      if (button === 'A') {
        // flip();
      } else if (button === 'B') {
        // ring();
      } else if (button === 'X') {
      }
    });

    this.onEnabled(() => {
      this.user.socket.emit(constant.event.PAGE_CHANGED, constant.page.GAMING);
    });

    this.onDestroyed(() => {
      this.user.room.leave(this.user);
    });
  }
}
