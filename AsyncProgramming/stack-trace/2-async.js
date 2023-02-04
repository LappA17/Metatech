'use strict';

const fs = require('node:fs');

//Здесь тоже самое только фции будут асинхронные и будем думать что нам это как-то поможет, то-есть то были синхронные фции и стекТрейс терялся здесь же асинхронно

const f1 = async () => {
  //setTimeout(() => {
  fs.promises.readFile().catch((err) => {
    //throw err;
    console.log('Catch 2', err);
  });
  //}, 0);
};

const f2 = async () => await f1();
const f3 = async () => await f2();

(async () => {
  try {
    await f3();
  } catch (err) {
    console.log('Catch 1', err); //мы бы здесь могли споймать ошибку если мы в f1 не делали catch, а делали б return Promise либо разкоментируем throw err; в f1()
  }
})();

/*
Пример с setTimeout
Ruslan@MacBook-Pro stack-trace % node 2-async.js 
Catch 2 TypeError [ERR_INVALID_ARG_TYPE]: The "path" argument must be of type string or an instance of Buffer or URL. Received undefined
    at open (node:internal/fs/promises:456:10)
    at Object.readFile (node:internal/fs/promises:820:20)
    at Timeout._onTimeout (/Users/Ruslan/Desktop/Work/timur-shemsedinov/Async-Programming/stack-trace/2-async.js:9:17)
    at listOnTimeout (node:internal/timers:559:17)
    at processTimers (node:internal/timers:502:7) {
  code: 'ERR_INVALID_ARG_TYPE'
}
То-есть наш стек трейс потерялся ! мы опять не видим где происходит проблема. Как только мы добавляем setTimeout то Промисы нас НЕ спасают

Пример БЕЗ setTimeout
Ruslan@MacBook-Pro stack-trace % node 2-async.js
Catch 2 TypeError [ERR_INVALID_ARG_TYPE]: The "path" argument must be of type string or an instance of Buffer or URL. Received undefined
    at open (node:internal/fs/promises:456:10)
    at Object.readFile (node:internal/fs/promises:820:20)
    at f1 (/Users/Ruslan/Desktop/Work/timur-shemsedinov/Async-Programming/stack-trace/2-async.js:9:15)
    at f2 (/Users/Ruslan/Desktop/Work/timur-shemsedinov/Async-Programming/stack-trace/2-async.js:16:30)
    at f3 (/Users/Ruslan/Desktop/Work/timur-shemsedinov/Async-Programming/stack-trace/2-async.js:17:30)
    at /Users/Ruslan/Desktop/Work/timur-shemsedinov/Async-Programming/stack-trace/2-async.js:21:11
    at Object.<anonymous> (/Users/Ruslan/Desktop/Work/timur-shemsedinov/Async-Programming/stack-trace/2-async.js:25:3)
    at Module._compile (node:internal/modules/cjs/loader:1126:14)
    at Object.Module._extensions..js (node:internal/modules/cjs/loader:1180:10)
    at Module.load (node:internal/modules/cjs/loader:1004:32) {
  code: 'ERR_INVALID_ARG_TYPE'
}
И мы видим что во втором примере БЕЗ setTimeout у нас уже появился stack trace, у нас есть f1, f2, f3
*/
