const constant = require('../constant');
const State = require('../State');

module.exports = class WaitingState extends State {
  constructor() {
    super(constant.state.WAITING);

    let players = []; // index is order, user is user
    let currentOrder = 0; // current user
    let alert = null; // alert message - victory, next turn, ringed etc

    // creating card suit
    const fruits = ["LEMON", "PEAR", "PINEAPPLE", "STRAWBERRY"];
    const cardSuit = []; // card han beul - 4*14==56 cards
    for (const i in fruits) {
      for (let j = 0; j < 5; ++j) {
        for (let k = 0; k < constant.CARD_COUNT[j]; ++k) {
          cardSuit.push([fruits[i], j + 1]);
        }
      }
    }
    console.log(`Card suit: ${cardSuit}`);
    let bellCards = [];

    this.onExecute(() => {
      const users = Object.values(this.room.users);

      // there is no user, leave the room
      if (users.length === 0) {
        this.pop();
        return;
      }

      if (this.alert) { // there is an alert, timer is paused
        this.room.emit(
          // alert
        );
      } else { // timer is running
        this.start = this.start ?? Date.now();
        const now = Date.now();
        const countdown = 9 - (Math.floor((now - this.start) / 1000) % 10);
        if (countdown === 0) { // time over
          currentOrder = (currentOrder + 1) % users.length;
          console.log(`In-game countdown reached`);
          console.log(`Next turn: ${players[currentOrder].id}`);
          this.start = now;
        } else {
          console.log(`In-game countdown: ${countdown}`);
          if (players[currentOrder].state.ring) {
            players[currentOrder].state.ring = false;
            console.log(`${players[currentOrder].id} ringed the bell!`);
            currentOrder = (currentOrder + 1) % users.length;
            console.log(`Next turn: ${players[currentOrder].id}`);
            this.start = now;
          } else if (players[currentOrder].state.flip) {
            players[currentOrder].state.flip = false;
            console.log(`${players[currentOrder].id} flipped the card`);
            currentOrder = (currentOrder + 1) % users.length;
            console.log(`Next turn: ${players[currentOrder].id}`);
            this.start = now;
          }
        }
      }

    });


    this.onEnabled(() => {
      // adding users to seperated array, and set order for each users

      const users = Object.values(this.room.users);
      console.log(`this room name: ${this.room.name}`);
      console.log(`Current users length: ${users.length}`);

      for (const [index, user] of users.entries()) {
        players[index] = user;
        console.log(`${players[index].id} index: ${index}`);
      }

      // shuffling cards of card suit
      cardSuit.map((el, i, arr) => {
        let r = ~~(Math.random() * arr.length);
        arr[i] = arr[r];
        arr[r] = el;
        return arr;
      })[0];
      // console.log(`Shuffled card suit: ${cardSuit}`);

      // slicing card suit and share them to users
      const quotient = (constant.FRUIT_COUNT * constant.CARD_COUNT.reduce((a, b) => a + b, 0)) / users.length;
      const remainder = (constant.FRUIT_COUNT * constant.CARD_COUNT.reduce((a, b) => a + b, 0)) % users.length;
      for (const [index, user] of users.entries()) {
        user.cards = cardSuit.slice(quotient * index, quotient * (index + 1));
        console.log(`${user.id} Cards: ${user.cards}`);
      }
      bellCards = cardSuit.slice(quotient * users.length, cardSuit.length);
      console.log(`bellCards: ${bellCards}`);
    });
  }
}
