const constant = require('../constant');
const State = require('../State');

module.exports = class WaitingState extends State {
  constructor() {
    super(constant.state.WAITING);
    this.onExecute(() => {
      this.room.emit(
        constant.event.WAITING_ROOM_USERS,
        JSON.stringify(
          Object.values(this.users).map((user) =>
            ({id: user.id, ready: user.stateManager.peek().ready})
          )
        )
      );
    });
  }
}
