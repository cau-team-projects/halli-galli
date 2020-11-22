const constant = require('./constant');
const State = require('./State');
const ReadyState = require('./ReadyState');
const ExitDialogState = require('./ExitDialogState');
const switchRoom = require('./switchRoom');

module.exports = class WaitingState extends State {
  constructor() {
    super(constant.state.WAITING);

    this.on(constant.event.BUTTON_CLICKED, (button) => {
      if (button == 'A' || button == 'B') {
        this.replace(new ReadyState());
      } else if (button == 'X') {
        this.push(new ExitDialogState());
      }
    });

    this.onEnabled(() => {
      joinRoom(this.user, constant.room.WAITING);
    });

    this.onDisabled(() => {
      leaveRoom(this.user);
    });
  }
}
