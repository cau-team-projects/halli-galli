const constant = require('../../../common/constant');
const State = require('../State');
const RoomGamingState = require('./GamingState');
const UserGamingState = require('../user/GamingState');

module.exports = class WaitingState extends State {
  constructor() {
    super(constant.state.WAITING);
    this.ready = false;
    this.onExecute(() => {
      const users = Object.values(this.room.users);
      if (users.length === 0)
        return;
      // Exit dialog
      for (const user of users) {
        user.socket.emit(constant.event.EXIT_DIALOG, user.state.exitDialog);
      }
      if (this.ready) {
        this.start = this.start ?? Date.now();
        const now = Date.now();
        const countdown = constant.WAITING_COUNTDOWN_SECONDS
          - (Math.floor((now - this.start) / 1000) % (constant.WAITING_COUNTDOWN_SECONDS + 1));
        if (users.length > 0 && users.every((user) => user.stateManager.peek().ready)) {
          if (countdown === 0) {
            this.ready = false;
            for (const user of users)
              user.stateManager.push(new UserGamingState());
            this.push(new RoomGamingState());
            this.room.emit(
              constant.event.PAGE_CHANGED,
              constant.page.GAMING
            );
          } else {
            this.room.emit(
              constant.event.WAITING_COUNTDOWN,
              countdown
            );
          }
        } else {
          this.ready = false;
          this.start = null;
          this.room.emit(constant.event.WAITING_COUNTDOWN_CANCELED);
        }

      } else {
        if (users.length > 0 && users.every((user) => user.stateManager.peek().ready))
          this.ready = true;
        this.room.emit(
          constant.event.WAITING_USERS,
          users.map((user) =>
            ({id: user.id, ready: user.stateManager.peek().ready})
          )
        );
      }
    });
  }
}
