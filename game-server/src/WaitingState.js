const constant = require('./constant');
const State = require('./State');
const ReadyState = require('./ReadyState');
const ExitDialogState = require('./ExitDialogState');
const joinRoom = require('./joinRoom');
const leaveRoom = require('./leaveRoom');

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
      joinRoom(this.user, 'GAME');
      this.user.socket.emit(constant.event.PAGE_CHANGED, constant.page.WAITING);
    });

    this.onDisabled(() => {
      leaveRoom(this.user);
    });
  }
}
