const constant = require('./constant');
const State = require('./State');
const ReadyState = require('./ReadyState');
const ExitDialogState = require('./ExitDialogState');
const switchRoom = require('./switchRoom');

module.exports = class WaitingState extends State {
  constructor() {
    super(constant.state.WAITING_STATE);

    this.on(constant.event.BUTTON_CLICKED, (button) => {
      if (button == 'A' || button == 'B') {
        this.replace(new ReadyState());
      } else if (button == 'X') {
        this.push(new ExitDialogState());
      }
    });

    this.onEnabled(() => {
      this.user.room = constant.room.WAITING;
      this.user.socket.join(this.user.room);
      this.user.io.to(this.user.room).emit(constant.event.ROOM_JOINED, this.user.socket.id);
      console.log(`user ${this.user.socket.id} joins room ${this.user.room}`);
    });

    this.onDisabled(() => {
      this.user.room = constant.room.WAITING;
      this.user.socket.leave(this.user.room);
      this.user.io.to(this.user.room).emit(constant.event.ROOM_LEFT, this.user.socket.id);
      console.log(`user ${this.user.socket.id} left room ${this.user.room}`);
    });
  }
}
