const constant = require('../constant');
const State = require('../State');

module.exports = class GamingState extends State {
  constructor() {
    super(constant.state.GAMING);
    this.order = 0;
    this.playedCards = [];
    this.cards = [];
    this.score = 0;
    this.flip = false;
    this.ring = false;
    this.ringgedTimestamp = null;

    this.on(constant.event.BUTTON_CLICKED, (button) => {
      if (button === 'A') {
        this.flip = true;
      } else if (button === 'B') {
        this.ring = true;
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
