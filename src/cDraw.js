const canvas = require("./dom");
const font = require("./font");
const danmaku_object = require("./danmaku_object");

var height = 0;
setInterval(() => { height = 0 }, 2000)

class cDanmaku {

    constructor(option) {

        this.danmaku_store = new Array();
        //this.danmaku_sort = new Array();
        this.danmaku_video = new Array();
        this.danmaku_speed = 2;
        this.danmaku_played = false;
        this.canvas = option.ele || canvas;
        this.ctx = this.canvas.getContext("2d");
        this.ctx.font = font.weight + " " + font.size + "px " + font.family;
        this.ctx.strokeStyle = "#000000";
        this.ctx.fillStyle = "#ffffff";
        this.ctx.lineWidth = 1;
        this.position_x = this.canvas.width;
        this.media = option.media;
        this.work = new Worker('../dist/webwork.js');
        this.fps = 0;
        this.fps_console();

        if (option.type) {

            this.add_danmaku(option.danmaku);

            this.canvas.addEventListener("mouseup", this.danmaku_search.bind(this));
            this.canvas.addEventListener("contextmenu", function() {
                event.preventDefault();
            });
            this.media.addEventListener("play", function() {
                this.danmaku_played = true;
            }.bind(this));
            this.media.addEventListener("pause", function() {
                this.danmaku_played = false;
            }.bind(this));

        } else {
            this.danmaku_played = true;
        }

        this.work.addEventListener("message", function(e) {
            this.danmaku_video_add(e.data);
        }.bind(this), false);

        this.draw(option.type);
    }

    add_danmaku(array) {

        this.danmaku_store = this.danmaku_store.concat(array);
        this.danmaku_reset();

    }

    danmaku_reset() {

        this.work.postMessage({
            danmaku: this.danmaku_store,
            type: "data"
        });

    }

    danmaku_video_add(danmaku) {

        var _danmaku = new Object();
        _danmaku.content = danmaku.content;
        _danmaku.time = danmaku.time;
        _danmaku.position_x = this.position_x;
        _danmaku.position_y = (height + 1) * font.size;
        this.danmaku_video.push(new danmaku_object(_danmaku, font.size));
        this.danmaku_height();

    }

    danmaku_input(content) {

        var _danmaku = new Object();

        _danmaku.content = content;
        _danmaku.time = 0;
        _danmaku.position_x = this.position_x;
        _danmaku.position_y = (height + 1) * font.size;

        this.danmaku_video.push(new danmaku_object(_danmaku, font.size));
        this.danmaku_height();

    }

    danmaku_height() {

        if (height > this.canvas.height) {
            height = 0;
        } else {
            height++;
        }

    }

    danmaku_search(e) {

        if (e.button == 2) {

            var x = e.offsetX;
            var y = e.offsetY;
            var _search;

            for (let i = this.danmaku_video.length - 1; i >= 0; i--) {
                if (
                    x - this.danmaku_video[i].position_x > 0 &&
                    x - this.danmaku_video[i].position_x < this.danmaku_video[i].content.length * font.size &&
                    this.danmaku_video[i].position_y - y > 0 &&
                    this.danmaku_video[i].position_y - y < font.size
                ) {
                    _search = this.danmaku_video[i];
                    break;
                }

            }

            if (_search) {

                for (let i = 0; i < this.danmaku_store.length; i++) {

                    if (
                        this.danmaku_store[i].time == _search.time &&
                        this.danmaku_store[i].content == _search.content
                    ) {
                        let index = this.danmaku_store.indexOf(this.danmaku_store[i]);
                        console.log(this.danmaku_store[index]);
                    }

                }
            }
            console.log("end");
        }
    }

    danmaku_animation() {

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        for (let i = 0; i < this.danmaku_video.length; i++) {
            this.ctx.fillText(this.danmaku_video[i].content, this.danmaku_video[i].position_x, this.danmaku_video[i].position_y);
            this.ctx.strokeText(this.danmaku_video[i].content, this.danmaku_video[i].position_x, this.danmaku_video[i].position_y);
            this.danmaku_video[i].position_x -= this.danmaku_speed;
            if (this.danmaku_video[i].position_x < -this.danmaku_video[i].length) {
                this.danmaku_video.splice(i, 1);
                i--;
            }
        }

    }

    webwork_post(vTime) {

        this.work.postMessage({
            time: vTime,
            type: "time"
        });
    }

    draw(type) {


        this.fps++;

        if (this.danmaku_played) {
            this.danmaku_animation();
            this.webwork_post(this.media.currentTime);
        }

        requestAnimationFrame(this.draw.bind(this, type));
    }

    fps_console() {
        //性能测试
        setInterval(() => {
            console.log(`帧数：${this.fps}`);
            this.fps = 0;
        }, 1000);
    }
}

module.exports = cDanmaku;