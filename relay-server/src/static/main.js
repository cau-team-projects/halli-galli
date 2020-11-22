const socket = io();
var normalStart = false;
var userNum = 0;

function main() {
    function init() {
        page('/index', (ctx, next) => {
            $('body').empty();
            $.get('./index.html', (res) => {
                $('body').html(res);
            });
            normalStart = true;
        });
        
        page('/waiting', (ctx, next) => {
            if (!normalStart) return;
            $('body').empty();
            $.get('./waiting.html', (res) => {
                $('body').html(res);
            });
        });

        page('/play', (ctx, next) => {
            if (!normalStart) return;
            $('body').empty();
            $.get('./play.html', (res) => {
                $('body').html(res);
            });
        });

        page.exit('/play', (ctx, next) => {
            next();
        });

        page.exit('/waiting', (ctx, next) => {
            next();
        });

        page({hashbang: true});
        page.stop();
        page('/index');
    }
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
    if (room == 'HOME') {
        page('/index');
    }
    else if (room == 'WAITING') {
        page('/waiting');
    }
    else if (room == 'GAMING') {
        page('/play');
    }
});

socket.on('USER_ROOM_JOINED', function(room) {
    userNum++;
    if (userNum == 1) {
        items.push({
            name: "LEMON",
            number: "2",
            score: 200,
            card: "static/image/strawberry_2.svg"
        });
    }
    else if (userNum == 2) {
        items.push({
            name: "PEAR",
            number: "3",
            score: 300,
            card: "static/image/strawberry_3.svg"
        });
    }
    else if (userNum == 3) {
        items.push({
            name: "PINEAPPLE",
            number: "4",
            score: 400,
            card: "static/image/strawberry_4.svg"
        });
    }
});

socket.on('USER_ROOM_LEFT', function(room) {
    userNum--;
});

