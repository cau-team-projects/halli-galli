const constant = require('../constant');
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
      if (this.ready) {
        this.start = this.start ?? Date.now();
        const now = Date.now();
        const countdown = 9 - (Math.floor((now - this.start) / 1000) % 10);
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
            constant.event.WAITING_ROOM_COUNTDOWN,
            countdown
          );
        }
      } else {
        if (users.length > 0 && users.every((user) => user.stateManager.peek().ready))
          this.ready = true;
        this.room.emit(
          constant.event.WAITING_ROOM_USERS,
          users.map((user) =>
            ({id: user.id, ready: user.stateManager.peek().ready})
          )
        );
      }
    });
  }
}
