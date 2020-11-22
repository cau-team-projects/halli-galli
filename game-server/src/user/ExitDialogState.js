const constant = require('../constant');
const State = require('../State');

module.exports = class ExitDialogState extends State {
  constructor() {
    super(constant.state.EXIT_DIALOG);
    this.on(constant.event.BUTTON_CLICKED, (button) => {
      if (button == 'A') {
        this.pop(2);
      } else {
        this.pop(1);
      }
    });
  }
}
