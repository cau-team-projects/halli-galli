import $ from 'jquery';
import page from 'page';

const socket = io();
var normalStart = false;

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
    console.log(data);
    document.getElementById('message').innerText = data; 
});

socket.on('ROOM_JOINED', function(room) {
     // 
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

socket.on('ROOM_LEFT', function(room) {
    // left
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


///// User info
var source = $("#wait_user,#play_user").html();
var template = Handlebars.compile(source);
var data = {
items: [
{
name: "STRAWBERRY",
number: "1",
score: 100,
card: "static/image/strawberry_1.svg"
},
{
name: "LEMON",
number: "2",
score: 200,
card: "static/image/strawberry_2.svg"
},
{
name: "PEAR",
number: "3",
score: 300,
card: "static/image/strawberry_3.svg"
},
{
name: "PINEAPPLE",
number: "4",
score: 400,
card: "static/image/strawberry_4.svg"
}
]
};
var itemList = template(data);
$('.wait_user,.play_user').append(itemList);

