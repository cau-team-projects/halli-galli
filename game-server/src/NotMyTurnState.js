const constant = require('./constant');
const State = require('./State');
const switchRoom = require('./switchRoom');

module.exports = class NotMyTurnState extends State {
  constructor(constant.state.NOT_MY_TURN) {
    super();
    this.on(constant.event.BUTTON_CLICKED, (button) => {
      if (button === 'B') {
        // ring();
      } else if (button === 'X') {
        this.push(new ExitDialogState());
      }
    });
  }
}
