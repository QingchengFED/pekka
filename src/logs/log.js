const log4js = require('log4js');

log4js.configure({
  appenders: {
    file: {
      type: 'file',
      filename: 'logs/main.log',
      maxLogSize: 20480,
      backups: 10,
    },
    console: {
      type: 'stdout',
    },
  },
  categories: {
    development: {
      appenders: ['file', 'console'],
      level: 'all',
    },
    production: {
      appenders: ['file'],
      level: 'info',
    },
    default: {
      appenders: ['file'],
      level: 'info',
    },
  },
});

module.exports =
  process.env.NODE_ENV === 'development'
    ? log4js.getLogger('development')
    : log4js.getLogger('production');
