const constant = require('./constant');
const State = require('./State');
const WaitingState = require('./WaitingState');
const switchRoom = require('./switchRoom');

module.exports = class ReadyState extends State {
  constructor() {
    super(constant.state.READY);
    this.on(constant.event.BUTTON_CLICKED, (button) => {
      if (button == 'X') {
        this.replace(new WaitingState());
      }
    });
  }
}
