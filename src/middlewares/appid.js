/**
 * 中间件
 * 检查要翻译的appid是否存在
 */
const { appMap } = require('../configs');

module.exports = async function (ctx, next) {
  const appConfig = appMap.find(({ id }) => id === +ctx.params.id);
  if (!appConfig) ctx.throw(404, `app doesn't exist`);
  await next();
};
