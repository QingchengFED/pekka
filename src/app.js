const Koa = require('koa');
const path = require('path');
const static = require('koa-static');
const views = require('koa-views');
const koaLogger = require('koa-logger');
const router = require('./routers');
const bodyParser = require('koa-bodyparser');
const { port } = require('./configs');

const app = new Koa();

app.use(koaLogger());

app.use(bodyParser());

app.use(static(path.resolve('public')));

app.use(views(path.resolve('views'), { extension: 'ejs' }));

app.use(router.routes()).use(router.allowedMethods());

app.listen(port);
