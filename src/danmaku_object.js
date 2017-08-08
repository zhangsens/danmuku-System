function danmaku_object(option, font) {

    this.content = option.content;
    this.time = option.time;
    this.position_x = option.position_x;
    this.position_y = option.position_y;
    this.length = this.content.length * font;

}

module.exports = danmaku_object;