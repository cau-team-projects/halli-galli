const socket = io();

function main() {
  page('/home', (ctx, next) => {
    $('main').empty();
    $.get('/static/home.html', (res) => {
      $('main').html(res);
    });
  });
  page('/waiting', (ctx, next) => {
    $('main').empty();
    $.get('/static/waiting.html', (res) => {
      $('main').html(res);
      const source = $("#wait_user").html();
      const template = Handlebars.compile(source);
      
      socket.on('WAITING_USERS', function(users) {
        console.log(`user ${users} waiting`);
        $('.wait_user').html(template({items: Object.values(users)}));
      });
      socket.on('WAITING_COUNTDOWN', function(data) {
        console.log('countdown ${data} ...');
        $('.refresh_img img').css("visibility", "hidden");
        $('.count_down').css("visibility", "visible");
        $('.count_down').text(data);
      });
    });
  });
  page('/gaming', (ctx, next) => {
    $('main').empty();
    $.get('/static/play.html', (res) => {
      $('main').html(res);
      const source = $("#play_user").html();
      const template = Handlebars.compile(source);

      socket.on('GAMING_USERS', function(users) {
        $('.play_user').html(template({items: Object.values(users)}));
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

socket.on('GAME_CONNECTED', () => {
  console.log('game connected');
});

socket.on('GAME_DISCONNECTED', () => {
  console.log('game disconnected');
});

socket.on('PAGE_CHANGED', (pageName) => {
  console.log('page changed');
  page(pageName);
});

socket.on('ROOM_JOINED', function(room) {
  console.log(`joined room ${room}`);
});

socket.on('ROOM_LEFT', function(room) {
  console.log(`left room ${room}`);
});

socket.on('USER_ROOM_JOINED', function(user, room) {
  console.log(`user joined room ${room}`);
});

socket.on('USER_ROOM_LEFT', function(user, room) {
  console.log(`user left room ${room}`);
});
