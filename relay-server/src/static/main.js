import $ from 'jquery';
import page from 'page';

///// User info
var source = $("#wait_user,#play_user").html();
var template = Handlebars.compile(source);
var data = {
items: []
};
var itemList = template(data);
$('.wait_user,.play_user').append(itemList);


    ,
    

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
    console.log(data);
    document.getElementById('message').innerText = data; 
});

socket.on('ROOM_JOINED', function(room) {
    if (userNum == 0) {
        items.push({
            name: "STRAWBERRY",
            number: "1",
            score: 100,
            card: "static/image/strawberry_1.svg"
        });
    }
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

