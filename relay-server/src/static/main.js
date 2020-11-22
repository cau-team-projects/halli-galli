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
                    state_waiting = false;
                }
            });
            normalStart = true;
        });
        
        page('/waiting', (ctx, next) => {
            if (!normalStart) return;
            $.get('./waiting.html', (res) => {
                $('body').html(res);
                if (state_ready) {
                    // 나 레디함
                }
                
            });
        })
    }
}
    
   
socket.on('test', (data) => {
    console.log(data);
    document.getElementById('message').innerText = data; 
});

socket.on('waiting', function() {
     state_waiting = true;
});

socket.on('ready', function() {
    state_ready = true;
});

socket.on('play', function() {
    state_play = true;
});