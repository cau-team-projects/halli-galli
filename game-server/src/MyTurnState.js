const constant = require('./constant');
const State = require('./State');
const ExitDialogState = require('./ExitDialogState');
const switchRoom = require('./switchRoom');

module.exports = class MyTurnState extends State {
  constructor() {
    super(constant.state.MY_TURN);
    this.on(constant.event.BUTTON_CLICKED, (button) => {
      if (button == 'A') {
        // flip();
      } else if (button == 'B') {
        // ring();
      } else if (button == 'X') {
        this.push(new ExitDialogState());
      }
    });
  }
}
