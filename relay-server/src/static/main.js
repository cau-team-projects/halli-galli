const socket = io();

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
      
      $(document).ready(function() {
        $('.wait_user li:nth-child(1) .ready .ready_icon').attr("src","image/me1.svg");
        $('.wait_user li:nth-child(2) .ready .ready_icon').attr("src","image/me2.svg");
        $('.wait_user li:nth-child(3) .ready .ready_icon').attr("src","image/me3.svg");
        $('.wait_user li:nth-child(4) .ready .ready_icon').attr("src","image/me4.svg");
      });

      socket.on('WAITING_USERS', function(users) {
        console.log(`user ${users} waiting`);
        $('.wait_user').html(template({items: Object.values(users)}));
      });
      socket.on('WAITING_COUNTDOWN', function(data) {
        $('.refresh_img img').css("visibility", "hidden");
        $('.count_down').css("visibility", "visible");
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
      
      $(document).ready(function() {
        $('.user_list_wrap li:nth-child(1) .user_ .id .user_icon').attr("src","image/me1.svg");
        $('.user_list_wrap li:nth-child(2) .user_ .id .user_icon').attr("src","image/me2.svg");
        $('.user_list_wrap li:nth-child(3) .user_ .id .user_icon').attr("src","image/me3.svg");
        $('.user_list_wrap li:nth-child(4) .user_ .id .user_icon').attr("src","image/me4.svg");
      });
      
      socket.on('GAMING_USERS', (users) => {
        console.log(users);
        for (const user of users) {
          if (user.topCard === null) {
            user.topCardImage = 'static/image/random_card.svg';
            continue;
          }
          const topCardImage = `static/image/${user.topCard.fruit}_${user.topCard.count}.svg`;
          user.topCardImage = topCardImage;
        };
        $('#user_list').html(
          userListTemplate({users})
        );
      });
      socket.on('GAMING_CARD_FLIPPED', function(user) {
        console.log("card fliped!!!!!");
        $(".user_card img").toggleClass('flip');
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
