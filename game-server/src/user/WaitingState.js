const constant = require('../constant');
const joinRoom = require('../joinRoom');
const leaveRoom = require('../leaveRoom');
const State = require('../State');
const ExitDialogState = require('./ExitDialogState');

module.exports = class WaitingState extends State {
  constructor() {
    super(constant.state.WAITING);

    this.on(constant.event.BUTTON_CLICKED, (button) => {
      if (button == 'A' || button == 'B') {
        
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
