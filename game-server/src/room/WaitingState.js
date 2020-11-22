const constant = require('../constant');
const State = require('../State');

module.exports = class WaitingState extends State {
  constructor() {
    super(constant.state.WAITING);
    this.onExecute(() => {
      //console.log(this.room.users);
      this.room.emit(
        constant.event.WAITING_ROOM_USERS,
        Object.values(this.room.users).map((user) =>
          ({id: user.id, ready: user.stateManager.peek().ready})
        )
      );
    });
  }
}
