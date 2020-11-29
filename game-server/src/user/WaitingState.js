const constant = require('../../../common/constant');
const State = require('../State');

module.exports = class WaitingState extends State {
  constructor() {
    super(constant.state.WAITING);

    this.ready = false;
    this.exitDialog = false;

    this.on(constant.event.BUTTON_CLICKED, (button) => {
      if (this.user.room.state.ready)
        return;
      if (button == 'A' || button == 'B') {
        if (this.exitDialog)
          this.pop(1);
        else
          this.ready = true;
      } else if (button == 'X') {
        if (this.exitDialog)
          this.exitDialog = false;
        else if (this.ready)
          this.ready = false;
        else
          this.exitDialog = true;
      }
    });

    this.onEnabled(() => {
      this.user.rooms['GAME'].join(this.user);
      this.user.socket.emit(constant.event.PAGE_CHANGED, constant.page.WAITING);
    });

    this.onDestroyed(() => {
      this.user.rooms['GAME'].leave(this.user);
    });
  }
}
