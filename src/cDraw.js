const canvas = require("./dom");
const font = require("./font");

var height = 0;
setInterval(() => { height = 0 }, 2000)

class cDraw {
    constructor(option) {

        this.danmaku_store = new Array();
        this.danmaku_sort = new Array();
        this.danmaku_video = new Array();
        this.danmaku_speed = 2;
        this.danmaku_played = true;
        this.canvas = option.ele || canvas;
        this.ctx = this.canvas.getContext("2d");
        this.gradient = this.ctx.createLinearGradient(0, 0, this.canvas.width, 0);
        this.position_x = this.canvas.width;
        this.media = option.media;
        this.add_danmaku(option.danmaku);

        this.ctx.font = font.weight + " " + font.size + "px " + font.family;

        requestAnimationFrame(this.danmaku_animation.bind(this));
        requestAnimationFrame(this.danmaku_video_add_animation.bind(this));
    }

    add_danmaku(array) {
        this.danmaku_store = this.danmaku_store.concat(array);
        this.danmaku_sort_reset();
    }

    danmaku_animation() {
        this.ctx.clearRect(0, 0, 1200, 800);
        for (let i = 0; i < this.danmaku_video.length; i++) {
            // this.gradient.addColorStop("0", "black");
            // this.ctx.strokeStyle = this.gradient;
            // this.ctx.strokeText(this.danmaku_video[i].content, this.danmaku_video[i].position_x, this.danmaku_video[i].position_y);
            this.gradient.addColorStop("0", "white");
            this.ctx.fillStyle = this.gradient;
            this.ctx.fillText(this.danmaku_video[i].content, this.danmaku_video[i].position_x, this.danmaku_video[i].position_y);
            this.danmaku_video[i].position_x += -this.danmaku_speed;
            if (this.danmaku_video[i].position_x < -this.danmaku_video[i].content.length * font.size) {
                this.danmaku_video.splice(i, 1);
                i--;
            }
        }

        if (this.danmaku_played) {
            requestAnimationFrame(this.danmaku_animation.bind(this));
        }

    }

    danmaku_video_add_animation() {

        for (let i = 0; i < this.danmaku_sort.length; i++) {
            if (this.danmaku_sort.length > 0 && this.danmaku_sort[0].time < this.media.currentTime) {
                this.danmaku_sort[0].position_x = this.position_x;
                this.danmaku_sort[0].position_y = (height + 1) * font.size;
                this.danmaku_video.push({ content: this.danmaku_sort[0].content, position_x: this.danmaku_sort[0].position_x, position_y: this.danmaku_sort[0].position_y });
                //this.danmaku_video = this.danmaku_video.concat([this.danmaku_sort[0]]);
                this.danmaku_sort.splice(0, 1);
                height++;
                i--;
            }
        }
        if (this.danmaku_played) {
            requestAnimationFrame(this.danmaku_video_add_animation.bind(this));
        }

    }

    danmaku_sort_reset() {
        this.danmaku_sort = [].concat(this.danmaku_store);
        this.danmaku_sort.sort(function(a, b) {
            return a.time - b.time;
        });
        for (let i = 0; i < this.danmaku_sort.length; i++) {
            if (this.danmaku_sort[0].time < this.media.currentTime) {
                this.danmaku_sort.splice(0, 1);
                i--;
            }
        }
    }
}

module.exports = cDraw;