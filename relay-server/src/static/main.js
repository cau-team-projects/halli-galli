const socket = io();
let selfId = null;

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
      
      $('.wait_user li:nth-child(1) .ready .ready_icon').attr("src","static/image/me1.svg");
      $('.wait_user li:nth-child(2) .ready .ready_icon').attr("src","static/image/me2.svg");
      $('.wait_user li:nth-child(3) .ready .ready_icon').attr("src","static/image/me3.svg");
      $('.wait_user li:nth-child(4) .ready .ready_icon').attr("src","static/image/me4.svg");
      
      socket.on('WAITING_USERS', function(users) {
        $('.wait_user').html(template({items: Object.values(users)}));
      });
      socket.on('WAITING_COUNTDOWN', function(data) {
        $('.refresh_img img').css("visibility", "hidden");
        $('.count_down').css("visibility", "visible");
        $('.count_down').text(data);
      });
      socket.on('WAITING_COUNTDOWN_CANCELED', function(data) {
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
      const currentUserTemplate = Handlebars.compile($('#current_user_template').html());
      
      $('.user_list_wrap li:nth-child(1) .user_ .id .user_icon').attr("src","static/image/me1.svg");
      $('.user_list_wrap li:nth-child(2) .user_ .id .user_icon').attr("src","static/image/me2.svg");
      $('.user_list_wrap li:nth-child(3) .user_ .id .user_icon').attr("src","static/image/me3.svg");
      $('.user_list_wrap li:nth-child(4) .user_ .id .user_icon').attr("src","static/image/me4.svg");
      $('.user_card img:nth-child(1)').addClass('user_card_highlight');
      $('.user_list_wrap li:nth-child(1)').addClass('user_list_color');
      
      socket.on('GAMING_USERS', (users) => {
        for (const user of users) {
          user.topCardImage = user.topCard === null
            ? 'static/image/random_card.svg'
            : `static/image/${user.topCard.fruit}_${user.topCard.count}.svg`;
          user.isSelf = user.id === selfId;
        }
        $('#user_list').html(
          userListTemplate({users})
        );
      });
      socket.on('GAMING_CARD_FLIPPED', function(user) {
        console.log("card fliped!!!!!");
        $(".user_card img").addClass('flip');
      });
      socket.on('GAMING_TURN', function(user, countdown) {
        $('#current_user').html(currentUserTemplate({currentUser: {id: user, countdown}}));
        if (user.id == socket.id) {
          $(".user_card img").css();
        }
      });
      socket.on('GAMING_WIN', function(user) {
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

socket.on('GAME_CONNECTED', (id) => {
  console.log('game connected');
  selfId = id;
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
