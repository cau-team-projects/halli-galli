import $ from 'jquery';
import page from 'page';

var socket = io();

function main() {
    let normalStart = false;

    socket.on('join', function(data) {
        var userInfo = '';
        userInfo += '<li>';
        userInfo += ''
    });

    socket.on('waiting', function() {
        page('/index', (ctx, next) => {
            $('body').empty();
            $.get('./static/waiting.html', (res) => {
                $('body').html(res);
            });
            normalStart = true;    
        });
    });

    socket.on('ready', function() {
        
    });

    socket.on('play', function(data) {
        page('/waiting', (ctx, next) => {
            if(!normalStart) return;
            $('body').empty();
            $.get('./static/play.html', (res) => {
                $('body').html(res);
            });
        });
    });

    socket.on('exit_home', function() {
        page("/index");
    });

    socket.on('exit', function() {

    });
}


main();