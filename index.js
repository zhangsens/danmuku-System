const koa = require("koa");
const static = require("koa-static");
const router = require("koa-router")();
const path = require("path");
const fs = require("fs");
const port = 1111;

const app = new koa();


router.get('/', async(ctx, next) => {

    var html = fs.readFileSync("demo.html", "utf8");
    ctx.response.body = html;

});

app.use(static(path.join(__dirname, '/')));
app.use(router.routes());

app.listen(port);