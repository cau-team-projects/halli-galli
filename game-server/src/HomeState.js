const constant = require('./constant');
const State = require('./State');
const WaitingState = require('./WaitingState');
const switchRoom = require('./switchRoom');

module.exports = class HomeState extends State {
  constructor() {
    super(constant.state.HOME);

    this.on(constant.event.BUTTON_CLICKED, (button) => {
      console.log(`button ${button} clicked`);
      if (button == 'A' || button == 'B') {
        switchRoom(this.user, constant.room.WAITING);
        this.push(new WaitingState());
      }
    });

    this.onEnabled(() => {
      this.user.room = constant.room.HOME;
      this.user.socket.join(this.user.room);
      this.user.io.to(this.user.room).emit(constant.event.ROOM_JOINED, this.user.socket.id);
      console.log(`user ${this.user.socket.id} joins room ${this.user.room}`);
    });
  }
}
