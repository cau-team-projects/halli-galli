const constant = require('../constant');
const State = require('../State');

module.exports = class WaitingState extends State {
  constructor() {
    super(constant.state.WAITING);

    let players = []; // index is order, user is user
    let currentOrder = 0; // current user
    let ringged = false;
    let ringgedTimestamp = null;
    let alert = null; // alert message - victory, next turn, ringed etc

    // creating card suit
    const fruits = ["LEMON", "PEAR", "PINEAPPLE", "STRAWBERRY"];
    const cardSet = []; // card han beul - 4*14==56 cards
    let bellCards = []; // cards under the bell
    for (const i in fruits) {
      for (let j = 0; j < 5; ++j) {
        for (let k = 0; k < constant.CARD_COUNT[j]; ++k) {
          const newCard = {fruit: fruits[i], count: j + 1}
          cardSet.push(newCard);
        }
      }
    }
    console.log(`Card suit:`);
    for (const [index, card] of cardSet.entries()) {
      console.log(`${card.fruit}, ${card.count}`);
    }

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
        
        // time over
        if (countdown === 0) {
          currentOrder = (currentOrder + 1) % users.length;
          console.log(`In-game countdown reached`);
          console.log(`Next turn: ${players[currentOrder].id}`);
          this.start = now;
        } else {
          console.log(`In-game countdown: ${countdown}`);

          // ring
          for (const [index, player] of players.entries()) {
            if (player.state.ring) {
              ringged = true;
              ringgedTimestamp = Date.now();
              player.state.ringgedTimestamp = ringgedTimestamp;
              player.state.ring = false;
              console.log(`${player.id} ringed the bell at ${player.state.ringgedTimestamp}!! `);
            }
          }
          if (ringged) {
            let firstRinggedOrder = null;
            for (const [index, player] of players.entries()) {
              if (!firstRinggedOrder)
                firstRinggedOrder = index;
              else {
                if (player.state.ringgedTimestamp < ringgedTimestamp)
                  firstRinggedOrder = index;
              }
            }
            console.log(`${players[firstRinggedOrder].id} is the fastest!!`);
            for (const player of players) {
              const frontCards = player.state.frontCards;
              players[firstRinggedOrder].state.cards.concat(frontCards);
              player.state.frontCards = [];
              player.state.ring = false;
              player.state.ringgedTimestamp = null;
            }
            ringged = false;
            ringgedTimestamp = null;
          }

          // flip
          for (const [index, player] of players.entries()) {
            if (player.state.flip) {
              player.state.ring = false;
              if (player.state.order === currentOrder) {
                const player = players[currentOrder];
                const flippedCard = player.state.cards[0];

                player.state.flip = false;
                console.log(`${player.id} flipped the card ${flippedCard.fruit}, ${flippedCard.count}`);
                player.state.playedCards.push(flippedCard);
                player.state.cards.shift();
                currentOrder = (currentOrder + 1) % users.length;
                /*
                console.log(`${player.id} cards:`);
                for (const card of player.state.cards) {
                  console.log(`${card.fruit}, ${card.count}`);
                }
                console.log(`${player.id} played cards:`);
                for (const card of player.state.playedCards) {
                  console.log(`${card.fruit}, ${card.count}`);
                }
                console.log(`Next turn: ${player.id}`);
                */
                this.start = now;
              }
            }
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
        players[index].order = index;
        console.log(`${players[index].id} index: ${index}`);
      }

      // shuffling cards of card suit
      cardSet.map((el, i, arr) => {
        let r = ~~(Math.random() * arr.length);
        arr[i] = arr[r];
        arr[r] = el;
        return arr;
      })[0];

      // slicing card suit and share them to users
      const quotient = (constant.FRUIT_COUNT * constant.CARD_COUNT.reduce((a, b) => a + b, 0)) / users.length;
      const remainder = (constant.FRUIT_COUNT * constant.CARD_COUNT.reduce((a, b) => a + b, 0)) % users.length;
      for (const [index, user] of users.entries()) {
        user.state.cards = cardSet.slice(quotient * index, quotient * (index + 1));
        console.log(`${user.id} Cards:`);
        for (const card of user.state.cards) {
          console.log(`${card.fruit}, ${card.count}`);
        }
      }
      bellCards = cardSet.slice(quotient * users.length, cardSet.length);
      console.log(`Bell cards:`);
      for (const card of bellCards) {
        console.log(`${card.fruit}, ${card.count}`);
      }
    });
  }
}
