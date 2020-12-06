module.exports = {
  FRUIT_COUNT: 4,
  CARD_COUNTS: [5, 3, 3, 2, 1],
  event: {
    BUTTON_CLICKED: 'BUTTON_CLICKED',
    //
    GAME_CONNECTED: 'GAME_CONNECTED',
    GAME_DISCONNECTED: 'GAME_DISCONNECTED',
    PAGE_CHANGED: 'PAGE_CHANGED',
    RELAY_CONNECTED: 'RELAY_CONNECTED',
    RELAY_DISCONNECTED: 'RELAY_DISCONNECTED',
    RELAY_ERROR: 'RELAY_ERROR',
    ROOM_JOINED: 'ROOM_JOINED',
    ROOM_LEFT: 'ROOM_LEFT',
    USER_GAME_CONNECTED: 'USER_GAME_CONNECTED',
    USER_GAME_DISCONNECTED: 'USER_GAME_DISCONNECTED',
    USER_ROOM_JOINED: 'USER_ROOM_JOINED',
    USER_ROOM_LEFT: 'USER_ROOM_LEFT',
    WAITING_USERS: 'WAITING_USERS',
    WAITING_COUNTDOWN: 'WAITING_COUNTDOWN',
    GAMING_USERS: 'GAMING_USERS',
    GAMING_BELL_RUNG: 'GAMING_BELL_RUNG',
    GAMING_CARD_FLIPPED: 'GAMING_CARD_FLIPPED',
    GAMING_CARD_LOST: 'GAMING_CARD_LOST',
    GAMING_CARD_GAINED: 'GAMING_CARD_GAINED',
    GAMING_TURN: 'GAMING_TURN',
    GAMING_LOST: 'GAMING_LOST',
    GAMING_WIN: 'GAMING_WIN'
  },
  state: {
    HOME: 'HOME',
    WAITING: 'WAITING',
    READY: 'READY',
    GAMING: 'GAMING',
    EXIT_DIALOG: 'EXIT_DIALOG'
  },
  room: {
    HOME: 'HOME'
  },
  roomState: {
    WAITING: 'WAITING',
    GAMING: 'GAMING'
  },
  page: {
    HOME: '/home',
    WAITING: '/waiting',
    GAMING: '/gaming',
  },
  fruits: ['LEMON', 'PEAR', 'PINEAPPLE', 'STRAWBERRY'],
  GAMING_TURN_SECONDS: 5
};
