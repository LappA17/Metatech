'use strict';

const threads = require('node:worker_threads');
const { isMainThread } = threads;

// Во-втором примере мы проверяли какой процесс запущен через process.channel, потому что когда мы форкаем через child_process, то у child_process внутри процесса появляется объект channel через который можно обмениваться сообщениями

module.exports = isMainThread ? require('./master') : require('./worker');
