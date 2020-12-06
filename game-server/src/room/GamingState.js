const constant = require('../../../common/constant');
const State = require('../State');

module.exports = class WaitingState extends State {
  constructor() {
    super(constant.state.WAITING);

    this.start = this.start ?? Date.now();
    let alert = null; // alert message - victory, next turn, ringed etc

    this.onExecute(() => {
      const users = Object.values(this.room.users);

      if (this.alert) { // there is an alert, timer is paused
        this.room.emit(
          // alert
        );
        return
      }
      const now = Date.now();
      const elapsed = Math.floor((now - this.start) / 1000);
      const turn = Math.floor(elapsed / constant.GAMING_TURN_SECONDS) % users.length;
      const countdown = constant.GAMING_TURN_SECONDS - (elapsed % constant.GAMING_TURN_SECONDS);
      this.room.emit(constant.event.GAMING_TURN, users[turn].id, countdown);
      console.log(`user ${users[turn].id}'s turn ${countdown} seconds`);

      users.sort((a, b) => a.state.rung - b.state.rung);
      const rungUsers = users.filter((user) => user.state.rung != Infinity);
      if (rungUsers.length > 0) {
        const firstRungUser = rungUsers[0];
        this.room.emit(constant.event.GAMING_BELL_RUNG, firstRungUser.id);
        console.log(`user ${firstRungUser.id} has rung the bell at ${firstRungUser.state.rung}`);
        if (this.cardsAssembled) {
          console.log(`${firstRungUser.id} gains card`);
        } else {
          console.log(`${firstRungUser} lost cards`);
        }
        for (const rungUser of rungUsers)
          rungUser.state.rung = Infinity;
      }
      /*
        // count fruits
        if (tr) { // Right ringing
          for (const player of players) {
            const frontCards = player.state.frontCards;
            players[firstRinggedOrder].state.cards.concat(frontCards);
            player.state.frontCards = [];
          }
        } else { // wrong ringing
          if (player.state.cards.length > 0) { // wrong ringing and penalty needed
            const penaltyCard = player.state.cards[0];
            player.state.cards.shift();
          } else { // wrong ringing but no more cards on the hand
            console.log(`${player.id} has no more cards!!`);
          }
        }
      }

      // flip
      for (const [index, player] of players.entries()) {
        if (player.state.front) {
          player.state.ring = false;
          if (player.id === users[turn].id) {
            if (players[turn].state.cards.length <= 0) {
              console.log(`${player.id} has no more cards!!`);
              break;
            }
            const player = players[turn];
            const frontCard = player.state.backCards.shift();

            player.state.front = false;
            console.log(`${player.id} front the card ${frontCard.fruit}, ${frontCard.count}`);
            player.state.playedCards.push();
            turn = (turn + 1) % users.length;
            console.log(`${player.id} cards:`);
            for (const card of player.state.cards) {
              console.log(`${card.fruit}, ${card.count}`);
            }
            console.log(`${player.id} played cards:`);
            for (const card of player.state.playedCards) {
              console.log(`${card.fruit}, ${card.count}`);
            }
            console.log(`Next turn: ${player.id}`);
          }
        }
      }
    */
    });

    this.onEnabled(() => {
      // adding users to seperated array, and set order for each users

      const users = Object.values(this.room.users);
      if (users.length === 0) {
        this.pop();
        return;
      }
      console.log(`this room name: ${this.room.name}`);
      console.log(`Current users length: ${users.length}`);

      const fruits = ["LEMON", "PEAR", "PINEAPPLE", "STRAWBERRY"];
      const cardSet = []; // card han beul - 4*14==56 cards
      for (const i in fruits) {
        for (let j = 0; j < 5; ++j) {
          for (let k = 0; k < constant.CARD_COUNTS[j]; ++k) {
            const newCard = {fruit: fruits[i], count: j + 1};
            cardSet.push(newCard);
          }
        }
      }

      // shuffling cards of card suit
      cardSet.map((el, i, arr) => {
        const r = ~~(Math.random() * arr.length);
        arr[i] = arr[r];
        arr[r] = el;
        return arr;
      })[0];

      // slicing card suit and share them to users
      const quotient = Math.floor(
        constant.FRUIT_COUNT * constant.CARD_COUNTS.reduce(
            (acc, count) => acc + count,
            0
        ) / users.length
      );
      for (const [index, user] of users.entries()) {
        user.state.backCards = cardSet.slice(quotient * index, quotient * (index + 1));
        console.log(`${user.id} Cards:`);
        for (const card of user.state.backCards) {
          console.log(`${card.fruit}, ${card.count}`);
        }
      }
    });
  }
}
