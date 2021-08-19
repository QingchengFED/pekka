const Router = require('koa-router');
const { getWords, saveWords, updatewords } = require('../controllers/i18n');
const appidWare = require('../middlewares/appid');

const router = (module.exports = new Router());

router.get(['/i18n/:id', '/i18n/:id/:lang'], appidWare, getWords);
router.post('/i18n/:id/:lang', appidWare, saveWords);
router.put('/i18n/:id', appidWare, updatewords);
