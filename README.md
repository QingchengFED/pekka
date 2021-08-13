# 前端i18n服务

> 服务基于koa2，存储用的本地json文件，后台表单页面使用ejs模板引擎+vue3+axios，使用pm2管理应用进程

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

### admin页面地址
```
/fe-i18n/admin/:id
```

### apis
```
/fe-i18n/api/i18n/:id
```
> `id` 在`src/config` 里配置需要翻译的project
- GET 获取翻译后json
- POST 储存语料key
- PUT 修改语料