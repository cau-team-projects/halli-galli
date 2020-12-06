const constant = require('../../../common/constant');
const State = require('../State');

module.exports = class GamingState extends State {
  constructor() {
    super(constant.state.GAMING);
    this.order = 0;
    this.playedCards = [];
    this.cards = [];
    this.score = 0;
    this.flipped = false;
    this.rung = false;
    this.rungTimestamp = null;

    this.on(constant.event.BUTTON_CLICKED, (button) => {
      if (button === 'A') {
        this.flipped = true;
      } else if (button === 'B') {
        this.rung = true;
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
