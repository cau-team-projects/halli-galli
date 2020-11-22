import $ from 'jquery';
import page from 'page';

const socket = io();
var normalStart = false;
var state_waiting = false;
var state_ready = false;
var state_play = false;

function main() {
    function init() {

        page('/index', (ctx, next) => {
            $('body').empty();
            $.get('./index.html', (res) => {
                $('body').html(res);
                if (state_waiting) {
                    page('/waiting');
                }
            });
            normalStart = true;
        });
        
        page('/waiting', (ctx, next) => {
            if (!normalStart) return;
            $('body').empty();
            $.get('./waiting.html', (res) => {
                $('body').html(res);
                if (state_ready) {
                    // 나 레디함
                    // socket.emit(??)
                }
                if (state_play) {
                    page('/play');
                }
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
            state_play = false;
            state_ready = false;
            next();
        });

        page.exit('/waiting', (ctx, next) => {
            state_waiting = false;
            state_ready = false;
            next();
        });

        page({hashbang: true});
        page.stop();
        page('/index');
    }
}
    
main();

socket.on('test', (data) => {
    console.log(data);
    document.getElementById('message').innerText = data; 
});

socket.on('ROOM_JOIN', function() {
     
});

socket.on('ROOM_LEFT', function() {

});

socket.on('ROOM_CHANGED', function(room) {
  if (room == 'WAITING')
    page('/waiting')
});
