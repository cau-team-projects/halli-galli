module.exports = {
  FRUIT_COUNT: 4,
  CARD_COUNT: 14,
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
    WAITING_ROOM_USERS: 'WAITING_ROOM_USERS',
    WAITING_ROOM_COUNTDOWN: 'WAITING_ROOM_COUNTDOWN'
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
  }
};
