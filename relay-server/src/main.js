import './static/halli_galli.css';
import './static/waiting.css';
//import {Game} from './game';
import $ from 'jquery';
import page from 'page';

function main() {
    let controls = null;
    let normalStart = false;

    function init() {
        page('/main', (ctx, next) => {
            $('body').empty();
            $.get('./static/index.html', (res) => {
                $('body').html(res);
                $('#go_waiting_button').click((event) => page('/waiting'));
            });
            normalStart = true;
        });
        page('/waiting', (ctx, next) => {
            if(!normalStart) return;
            $('body').empty();
            $.get('./static/waiting.html', (res) => {
                $('body').html(res);
                $('#button_ready').click((event) => {
                    event.preventDefault();
                    this.blur();
                });
            });
        });
    }
}

main();
