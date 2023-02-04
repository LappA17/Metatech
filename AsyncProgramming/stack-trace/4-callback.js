'use strict';

//Здесь все эти фции будут коллбека, те они не асинхронные(не возвращают промисы), а они с коллбеками

const f1 = (callback) => {
  //setTimeout(() => {
  callback(new Error('Where am I?'));
  //}, 0);
};

const f2 = (callback) => {
  f1(callback);
};

const f3 = (callback) => {
  f2(callback);
};

f3((err) => {
  console.log('Catch', err);
});

/*
Catch Error: Where am I?
    at Timeout._onTimeout (/Users/Ruslan/Desktop/Work/timur-shemsedinov/Async-Programming/stack-trace/4-callback.js:7:14)
    at listOnTimeout (node:internal/timers:559:17)
    at processTimers (node:internal/timers:502:7)
Тоже мы видим что стрек-трейса нет

Если уберём setTimeout то уже появится
Catch Error: Where am I?
    at f1 (/Users/Ruslan/Desktop/Work/timur-shemsedinov/Async-Programming/stack-trace/4-callback.js:7:12)
    at f2 (/Users/Ruslan/Desktop/Work/timur-shemsedinov/Async-Programming/stack-trace/4-callback.js:12:3)
    at f3 (/Users/Ruslan/Desktop/Work/timur-shemsedinov/Async-Programming/stack-trace/4-callback.js:16:3)
    at Object.<anonymous> (/Users/Ruslan/Desktop/Work/timur-shemsedinov/Async-Programming/stack-trace/4-callback.js:19:1)
    at Module._compile (node:internal/modules/cjs/loader:1126:14)
    at Object.Module._extensions..js (node:internal/modules/cjs/loader:1180:10)
    at Module.load (node:internal/modules/cjs/loader:1004:32)
    at Function.Module._load (node:internal/modules/cjs/loader:839:12)
    at Function.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:81:12)
    at node:internal/main/run_main_module:17:47
*/
