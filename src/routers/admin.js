const Router = require('koa-router');
const appidWare = require('../middlewares/appid')
const { adminViews } = require('../controllers/i18n')

const router = (module.exports = new Router());

router.get('/:id', appidWare, adminViews);
