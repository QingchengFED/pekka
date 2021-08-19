const fs = require('fs');
const path = require('path');
const { array2obj } = require('../utils');
const { appMap } = require('../configs');
const logger = require('../logs/log');

const ZH_CN = 'zh-cn';
const EN_US = 'en-us';

module.exports = {
  getWords(ctx) {
    try {
      const { lang } = ctx.params;
      const words = lang ? getLocales(ctx, lang) : getAllLocales(ctx);
      ctx.body = { status: 200, data: words };
    } catch (error) {
      logger.error(error);
    }
  },
  // 上传
  saveWords(ctx) {
    try {
      const filePath = getFilePath(ctx);
      const { body } = ctx.request;
      fs.writeFileSync(filePath, JSON.stringify(body, null, '\t'));

      ctx.body = { status: 200, data: { success: true } };
    } catch (error) {
      logger.error(error);
    }
  },
  // 表单页面保存翻译
  updatewords(ctx) {
    try {
      const { body } = ctx.request;
      const zhFilePath = getFilePath(ctx, ZH_CN);
      const enFilePath = getFilePath(ctx, EN_US);
      fs.writeFileSync(zhFilePath, JSON.stringify(body[ZH_CN], null, '\t'));
      fs.writeFileSync(enFilePath, JSON.stringify(body[EN_US], null, '\t'));

      ctx.body = { status: 200, data: { success: true } };
    } catch (error) {
      logger.error(error);
    }
  },
  async adminViews(ctx) {
    try {
      const words = getAllLocales(ctx);
      const { id } = ctx.params;
      const apps = appMap.map(v => ({ id: v.id, name: v.name }));
      await ctx.render('admin', { words, id, apps });
    } catch (error) {
      logger.error(error);
      await ctx.throw(500);
    }
  },
};

function getAllLocales(ctx) {
  return {
    [ZH_CN]: getLocales(ctx, ZH_CN),
    [EN_US]: getLocales(ctx, EN_US),
  };
}

function getLocales(ctx, lang) {
  const filePath = getFilePath(ctx, lang);

  if (!fs.existsSync(filePath)) return {};

  const words = fs.readFileSync(filePath, 'utf-8');
  let data = (words && JSON.parse(words)) || {};

  return data;
}

function getFilePath(ctx, lang) {
  const { id: appid } = ctx.params;
  const appConfig = appMap.find(({ id }) => id === +appid);
  const { name } = appConfig;
  const filePath = path.resolve(`locales/${name}/${lang}.json`);
  return filePath;
}
