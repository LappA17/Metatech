'use strict';

const sum = (a, b) =>
  new Promise((resolve, reject) => {
    if (typeof a === 'number' && typeof b === 'number') {
      resolve(a + b);
    } else {
      reject(new Error('a and b should be numbers'));
    }
  });

// Здесь мы попробуем перехватить warning. Необработанные ошибки в Промисах сваливаются в этот warning
// в нашей 18 Ноде не console.log('IN PROCESS'); и не console.log('AFTER ALL !'); не будет !, хотя в видео Тимура в 10 Ноде удается перехватить эти warning, но там даже пишется что это диприкейтед(устаревший метод и так скоро нельзя будет делать)

process.on('warning', (warning) => {
  console.log('IN PROCESS');
  console.log({ warning });
});

sum(7, 'A').then((data) => {
  console.log(data);
});

setTimeout(() => {
  console.log('AFTER ALL !');
}, 1000);

/*
Ruslan@MacBook-Pro unhandled-errors-in-promises % node 5-warning.js
/Users/Ruslan/Desktop/Work/timur-shemsedinov/Async-Programming/unhandled-errors-in-promises/5-warning.js:8
      reject(new Error('a and b should be numbers'));
             ^

Error: a and b should be numbers
    at /Users/Ruslan/Desktop/Work/timur-shemsedinov/Async-Programming/unhandled-errors-in-promises/5-warning.js:8:14
    at new Promise (<anonymous>)
    at sum (/Users/Ruslan/Desktop/Work/timur-shemsedinov/Async-Programming/unhandled-errors-in-promises/5-warning.js:4:3)
    at Object.<anonymous> (/Users/Ruslan/Desktop/Work/timur-shemsedinov/Async-Programming/unhandled-errors-in-promises/5-warning.js:20:1)
    at Module._compile (node:internal/modules/cjs/loader:1126:14)
    at Object.Module._extensions..js (node:internal/modules/cjs/loader:1180:10)
    at Module.load (node:internal/modules/cjs/loader:1004:32)
    at Function.Module._load (node:internal/modules/cjs/loader:839:12)
    at Function.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:81:12)
    at node:internal/main/run_main_module:17:47
*/
