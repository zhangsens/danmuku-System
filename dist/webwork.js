var danmaku = new Array();

function sort(a, b) {
    return a.time - b.time;
}

addEventListener("message", function(e) {
    if (e.data.type == "data") {
        danmaku = danmaku.concat(e.data.danmaku).sort(sort);
        //postMessage(danmaku);
    } else if (e.data.type == "time") {
        for (let i = 0; i < danmaku.length; i++) {
            if (danmaku[i].time < e.data.time) {
                postMessage(danmaku[i])
                danmaku.splice(i, 1);
                i--;
            }
        }
    }
});

addEventListener("connect", function(e) {
    console.log(e);
});