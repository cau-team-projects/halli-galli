const constant = require('./constant');
const State = require('./State');
const ExitDialogState = require('./ExitDialogState');

module.exports = class GamingState extends State {
  constructor() {
    super(constant.state.GAMING);
    this.on(constant.event.BUTTON_CLICKED, (button) => {
      if (button === 'A') {
        // flip();
      } else if (button === 'B') {
        // ring();
      } else if (button === 'X') {
        this.push(new ExitDialogState());
      }
    });

    this.onDestroyed(() => {
      leaveRoom(this.user);
    });
  }
}
