'use strict';

// Здесь мы напишем такую фцию pause + мы еще избавились от readFile

const pause = (t) => new Promise((r) => setTimeout(r, t));

const f1 = async () => {
  //await pause(0);
  throw new Error('Where am I?');
};

const f2 = async () => await f1();

const f3 = async () => await f2();

(async () => {
  try {
    await f3();
  } catch (err) {
    console.log('Catch 1', err);
  }
})();

/*
Catch 1 Error: Where am I?
    at f1 (/Users/Ruslan/Desktop/Work/timur-shemsedinov/Async-Programming/stack-trace/3-pause.js:9:9)
    at async f2 (/Users/Ruslan/Desktop/Work/timur-shemsedinov/Async-Programming/stack-trace/3-pause.js:12:24)
    at async f3 (/Users/Ruslan/Desktop/Work/timur-shemsedinov/Async-Programming/stack-trace/3-pause.js:14:24)
    at async /Users/Ruslan/Desktop/Work/timur-shemsedinov/Async-Programming/stack-trace/3-pause.js:18:5

В Ноде Тимура будет только следующая ошибка
Catch 1 Error: Where am I?
    at f1 (/Users/Ruslan/Desktop/Work/timur-shemsedinov/Async-Programming/stack-trace/3-pause.js:9:9)
то-есть у Тимура цепочка не востанавливается и непонятно где она произошла 

Если мы закомментируем await pause(0) то уже стек трейс появится
Catch 1 Error: Where am I?
    at f1 (/Users/Ruslan/Desktop/Work/timur-shemsedinov/Async-Programming/stack-trace/3-pause.js:9:9)
    at f2 (/Users/Ruslan/Desktop/Work/timur-shemsedinov/Async-Programming/stack-trace/3-pause.js:12:30)
    at f3 (/Users/Ruslan/Desktop/Work/timur-shemsedinov/Async-Programming/stack-trace/3-pause.js:14:30)
    at /Users/Ruslan/Desktop/Work/timur-shemsedinov/Async-Programming/stack-trace/3-pause.js:18:11
    at Object.<anonymous> (/Users/Ruslan/Desktop/Work/timur-shemsedinov/Async-Programming/stack-trace/3-pause.js:22:3)
    at Module._compile (node:internal/modules/cjs/loader:1126:14)
    at Object.Module._extensions..js (node:internal/modules/cjs/loader:1180:10)
    at Module.load (node:internal/modules/cjs/loader:1004:32)
    at Function.Module._load (node:internal/modules/cjs/loader:839:12)
    at Function.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:81:12)
*/
