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
      var source = $("#wait_user").html();
      var template = Handlebars.compile(source);
      
      socket.on('WAITING_ROOM_USERS', function(users) {
        console.log(`user ${users} waiting`);
        items = users;
      });

      data = {items};
      var itemList = template(data);
      $('.wait_user').append(itemList);
    });
  });
  page('/play', (ctx, next) => {
    $('main').empty();
    $.get('/static/play.html', (res) => {
      $('main').html(res);
    });
  });
  page.exit('/play', (ctx, next) => {
    next();
  });
  page.exit('/waiting', (ctx, next) => {
    socket.off('WAITING_ROOM_USERS');
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