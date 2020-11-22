const constant = require('../constant');
const State = require('../State');

module.exports = class WaitingState extends State {
  constructor() {
    super(constant.state.WAITING);
    this.ready = false;
    this.exitDialog = false;

    this.on(constant.event.BUTTON_CLICKED, (button) => {
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
  }
}
