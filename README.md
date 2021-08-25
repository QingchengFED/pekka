# 前端 i18n 服务

> 服务基于 koa2，存储用的本地 json 文件，后台表单页面使用 ejs 模板引擎+vue3+axios，使用 pm2 管理应用进程

### 开发调试

```sh
npm run debug
```

### 启动服务

```sh
npm start
```

### 重启服务

```sh
npm restart
```

### admin 页面地址

```
/fe-i18n/admin/:id
```

> `id`: 配置在`src/config` 里的需要翻译的项目

### apis

- GET `/fe-i18n/api/i18n/:id{/:lang}` 获取翻译后 json
- POST `/fe-i18n/api/i18n/:id/:lang` 储存语料 key
- PUT `/fe-i18n/api/i18n/:id` 修改语料

### locales 目录结构

- locales/FitStreet/zh-cn.json
- locales/FitStreet/en-us.json
