const Router = require('koa-router');
const appidWare = require('../middlewares/appid');
const { getWords, saveWords, updatewords } = require('../controllers/i18n');

const router = (module.exports = new Router());

router.get('/i18n/:id', appidWare, getWords);
router.post('/i18n/:id', saveWords);
router.put('/i18n/:id', appidWare, updatewords);
