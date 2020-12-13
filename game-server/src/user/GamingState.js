const constant = require('../../../common/constant');
const State = require('../State');

module.exports = class GamingState extends State {
  constructor() {
    super(constant.state.GAMING);
    this.order = 0;
    this.frontCards = [];
    this.backCards = null;
    this.flipped = false;
    this.rung = Infinity;
    this.exitDialog = false;

    this.on(constant.event.BUTTON_CLICKED, (button) => {

      console.log(this.user.id, this.user.flipped, button);
      if (button === 'A') {
        if(this.exitDialog)
          this.pop(1);
        else
          this.flipped = true;
      } else if (button === 'B') {
        if(this.exitDialog)
          this.pop(1);
        else
          this.rung = Date.now();
      } else if (button === 'X') {
        if(this.exitDialog)
          this.exitDialog = false;
        else
          this.exitDialog = true;
      }
    });

    this.onEnabled(() => {
      this.user.socket.emit(constant.event.PAGE_CHANGED, constant.page.GAMING);

    });

    this.onDestroyed(() => {
      // this.user.room.leave(this.user);
    });
  }
  get topCard() {
    if (this.frontCards.length === 0)
      return null;
    return this.frontCards[this.frontCards.length - 1];
  }
  get frontCount() {
    return this.frontCards.length;
  }
  get backCount() {
    return this.backCards.length;
  }
}
