const Router = require('koa-router');
const api = require('./api');
const admin = require('./admin');
const { routerPrefix } = require('../configs');

const router = (module.exports = new Router());

router.prefix(routerPrefix);

router.use('/api', api.routes(), api.allowedMethods());
router.use('/admin', admin.routes(), admin.allowedMethods());

