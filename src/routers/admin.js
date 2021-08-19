const Router = require('koa-router');
const { adminViews } = require('../controllers/i18n');
const appidWare = require('../middlewares/appid');

const router = (module.exports = new Router());

router.get('/:id', appidWare, adminViews);
