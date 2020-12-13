const socket = io();
let selfId = null;
let turnId = null;
let turnCountDown = null;
let exitDialog = false;
const bell = new Audio('static/bell.ogg');

function main() {
  page('/home', (ctx, next) => {
    $('main').empty();
    $.get('/static/home.html', (res) => {
      $('main').html(res);
    });
  });

  page('/waiting', (ctx, next) => {
    console.log('waiting page!');
    $('main').empty();
    $.get('/static/waiting.html', (res) => {
      $('main').html(res);
      const source = $("#wait_user").html();
      const template = Handlebars.compile(source);
      socket.on('WAITING_USERS', (users) => {
        for (const user of users) {
          user.isSelf = user.id === selfId;
        }
        $('.wait_user').html(template({items: Object.values(users)}));
      });
      socket.on('EXIT_DIALOG', (open) => {
        exitDialog = open;
      });
      socket.on('WAITING_COUNTDOWN', (data) => {
        $('.refresh_img img').css("visibility", "hidden");
        $('.count_down').css("visibility", "visible");
        $('.count_down').text(data);
      });
      socket.on('WAITING_COUNTDOWN_CANCELED', (data) => {
        $('.refresh_img img').css("visibility", "visible");
        $('.count_down').css("visibility", "hidden");
        $('.count_down').text(data);
      });
    });
  });

  page('/gaming', (ctx, next) => {
    $('main').empty();
    $.get('/static/play.html', (res) => {
      $('main').html(res)
      const userListTemplate = Handlebars.compile($('#user_list_template').html());
      
      /* 
      $('.user_list_wrap li:nth-child(1) .user_ .id .user_icon').attr("src","static/image/me1.svg");
      $('.user_list_wrap li:nth-child(2) .user_ .id .user_icon').attr("src","static/image/me2.svg");
      $('.user_list_wrap li:nth-child(3) .user_ .id .user_icon').attr("src","static/image/me3.svg");
      $('.user_list_wrap li:nth-child(4) .user_ .id .user_icon').attr("src","static/image/me4.svg");
      $('.user_card img:nth-child(1)').addClass('user_card_highlight');
      $('.user_list_wrap li:nth-child(1)').addClass('user_list_color');
      */

      socket.on('GAMING_USERS', (users) => {
        for (const user of users) {
          user.topCardImage = user.topCard === null
            ? 'static/image/random_card.svg'
            : `static/image/${user.topCard.fruit}_${user.topCard.count}.svg`;
          user.isSelf = user.id === selfId;
          user.isTurn = user.id === turnId;
        }
        $('#user_list').html(
          userListTemplate({users, turnCountDown})
        );
      });
      socket.on('EXIT_DIALOG', (open) => {
        exitDialog = open;
      });
      socket.on('GAMING_CARD_FLIPPED', (user) => {
        $(".user_card img").addClass('flip');
      });
      socket.on('GAMING_TURN', (userId, countdown) => {
        turnId = userId;
        turnCountDown = countdown;
      });
      socket.on('GAMING_WIN', (userId) => {
        if (userId === selfId)
          alert('YOU WIN');
      });
      socket.on('GAMING_LOST', (userId) => {
        if (userId === selfId)
          alert('YOU LOST');
      });
      socket.on('GAMING_BELL_RUNG', (user) => {
        bell.play();
        setTimeout(() => {
          bell.pause();
          bell.currentTime = 0;
        }, 500);
      });
    });
  });
  page.exit('/gaming', (ctx, next) => {
    next();
  });
  page.exit('/waiting', (ctx, next) => {
    socket.off('WAITING_USERS');
    next();
  });

  page({hashbang: true});
  page.stop();
}
main();

///// Socket
socket.on('test', (data) => {
  $('#message').text(data); 
});

socket.on('GAME_CONNECTED', (userId) => {
  console.log('game connected');
  selfId = userId;
});

socket.on('GAME_DISCONNECTED', () => {
  console.log('game disconnected');
});

socket.on('PAGE_CHANGED', (pageName) => {
  console.log('page changed');
  page(pageName);
});

socket.on('ROOM_JOINED', (roomId) => {
  console.log(`joined room ${roomId}`);
});

socket.on('ROOM_LEFT', (roomId) => {
  console.log(`left room ${roomId}`);
});

socket.on('USER_ROOM_JOINED', (userId, roomId) => {
  console.log(`user joined room ${roomId}`);
});

socket.on('USER_ROOM_LEFT', (userId, roomId) => {
  console.log(`user left room ${roomId}`);
});
