const constant = require('../../../common/constant');
const State = require('../State');

module.exports = class WaitingState extends State {
  constructor() {
    super(constant.state.WAITING);

    this.start = Date.now();
    this.elapsed = 0;
    let alert = null; // alert message - victory, next turn, ringed etc

    this.onExecute(() => {

      if (this.alert) { // there is an alert, timer is paused
        this.room.emit(
          // alert
        );
        return
      }

      const users = Object.values(this.room.users);

      this.elapsed += Date.now() - this.start;
      const elapsedSeconds = Math.floor(this.elapsed / 1000);

      const turn = Math.floor(elapsedSeconds / constant.GAMING_TURN_SECONDS) % users.length;
      const countdown = constant.GAMING_TURN_SECONDS - (elapsedSeconds % constant.GAMING_TURN_SECONDS);
      this.room.emit(constant.event.GAMING_TURN, users[turn].id, countdown);
      console.log(`user ${users[turn].id}'s turn ${countdown} seconds`);

      const lostUsers = users.filter((user) => user.state.backCards.length < 1);
      const survivedUsers = users.filter((user) => user.state.backCards.length > 0);

      users.sort((a, b) => a.state.rung - b.state.rung);
      const rungUsers = users.filter((user) => user.state.rung != Infinity);
      if (rungUsers.length > 0) {
        const firstRungUser = rungUsers[0];
        const otherUsers = users.filter((user) => user.id != firstRungUser.id);
        this.room.emit(constant.event.GAMING_BELL_RUNG, firstRungUser.id);
        this.elapsed += countdown * 1000;
        console.log(`user ${firstRungUser.id} has rung the bell at ${firstRungUser.state.rung}`);

        // Figure out if more than one sort of fruits have FIVE amounts
        this.cardsAssembled = false;
        this.fruitCount = {};
        for (const fruit of constant.fruits) {
          this.fruitCount[fruit] = 0;
        }
        for (const user of users) {
          if (user.state.frontCards.length > 0) {
            this.fruitCount[user.state.frontCards[0].fruit] += user.state.frontCards[0].count;
          }
        }
        for (const fruit of constant.fruits) {
          if (this.fruitCount[fruit] == 5) {
            this.cardsAssembled = true;
          }
        }
        console.log(this.cardsAssembled);

        if (this.cardsAssembled) {
          // player rung correctly!
          const wonCards = [];
          for (otherUser of otherUsers)
            wonCards.push(otherUser.state.backCards.shift());
          firstRungUser.state.backCards.push(...wonCards);
          this.room.emit(constant.event.GAMING_CARD_GAINED, firstRungUser.id, wonCards.length);
          console.log(`user ${firstRungUser.id} gained ${wonCards.length} cards`);
        } else {
          // player rung wrongly!
          if (firstRungUser.state.backCards.length < users.length - 1) {
            this.room.emit(constant.event.GAMING_LOST, firstRungUser.id);
            console.log(`${firstRungUser.id} have no card to lost`);
            console.log(`${firstRungUser.id} lost the game!`);
          } else {
            const lostCards = firstRungUser.state.backCards.splice(0, users.length - 1);
            for (const [lostCardIdx, lostCard] in lostCards.entries())
              otherUsers[lostCardIdx].state.backCards.push(lostCard);
            this.room.emit(constant.event.GAMING_CARD_LOST, firstRungUser.id, lostCards.length);
            console.log(`user ${firstRungUser.id} lost ${lostCards.length} cards`);
          }
        }
        // restore all user's rung value to infinity
        for (const rungUser of rungUsers)
          rungUser.state.rung = Infinity;
      }

      const currentUser = users[turn];

      if (currentUser.state.flipped) {
        const frontCard = currentUser.state.backCards.shift();
        currentUser.state.frontCards.push(frontCard);
        this.elapsed += countdown * 1000;
      } else if(countdown === 0) {
        const frontCard = currentUser.state.backCards.shift();
        currentUser.frontCards.push(frontCard);
      }

      for (const user of users) {
        user.state.flipped = false;
      }

      this.start = Date.now();
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

      const cardSet = [];
      for (const i in constant.fruits) {
        for (let j = 0; j < 5; ++j) {
          for (let k = 0; k < constant.CARD_COUNTS[j]; ++k) {
            const newCard = {fruit: constant.fruits[i], count: j + 1};
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
