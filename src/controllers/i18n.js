const fs = require('fs');
const path = require('path');
const { array2obj } = require('../utils');
const { appMap } = require('../configs');
const logger = require('../logs/log');

module.exports = { getWords, saveWords, updatewords, adminViews };

function getWords(ctx) {
  try {
    const words = getLocales(ctx);
    ctx.body = { status: 200, data: words };
  } catch (error) {
    logger.error(error);
  }
}

function saveWords(ctx) {
  try {
    const filePath = getFilePath(ctx);
    const { body } = ctx.request;
    const data = array2obj(body);
    const words = { ...data, ...getLocales(ctx) };
    fs.writeFileSync(filePath, JSON.stringify(data, null, '\t'));

    ctx.body = { status: 200, data: words };
  } catch (error) {
    logger.error(error);
  }
}

function updatewords(ctx) {
  try {
    const { body } = ctx.request;
    const data = getLocales(ctx);
    Object.entries(body).forEach(([key, val]) => {
      data[key] = val;
    });
    const filePath = getFilePath(ctx);
    fs.writeFileSync(filePath, JSON.stringify(data, null, '\t'));

    ctx.body = { status: 200, data };
  } catch (error) {
    logger.error(error);
  }
}

async function adminViews(ctx) {
  const words = getLocales(ctx);
  const { id } = ctx.params;
  const apps = appMap.map(v => ({ id: v.id, name: v.appName }));
  await ctx.render('admin', { words, id, apps });
}

function getLocales(ctx) {
  const filePath = getFilePath(ctx);
  const words = fs.readFileSync(filePath, 'utf-8');
  const data = (words && JSON.parse(words)) || {};
  return data;
}

function getFilePath(ctx) {
  const appConfig = appMap.find(({ id }) => id === +ctx.params.id);
  const { filename } = appConfig;
  const filePath = path.resolve(`locales/${filename}.json`);
  return filePath;
}
