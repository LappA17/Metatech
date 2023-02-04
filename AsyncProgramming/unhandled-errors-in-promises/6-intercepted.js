'use strict';

const sum = (a, b) =>
  new Promise((resolve, reject) => {
    if (typeof a === 'number' && typeof b === 'number') {
      resolve(a + b);
    } else {
      reject(new Error('a and b should be numbers'));
    }
  });

// unhandledRejection уже касается только Ноды
// если у нас опять же не будет обработчика catch и мы в process.on повесим событие unhandledRejection, нам в коллбек прийдёт reason и промис и мы их обработаем

process.on('unhandledRejection', (reason, promise) => {
  console.log({ unhandledRejection: { reason, promise } });
});

sum(7, 'A').then((data) => {
  console.log({ data });
});

/*
{
  unhandledRejection: {
    reason: Error: a and b should be numbers
        at /Users/Ruslan/Desktop/Work/timur-shemsedinov/Async-Programming/unhandled-errors-in-promises/6-intercepted.js:8:14
        at new Promise (<anonymous>)
        at sum (/Users/Ruslan/Desktop/Work/timur-shemsedinov/Async-Programming/unhandled-errors-in-promises/6-intercepted.js:4:3)
        at Object.<anonymous> (/Users/Ruslan/Desktop/Work/timur-shemsedinov/Async-Programming/unhandled-errors-in-promises/6-intercepted.js:19:1)
        at Module._compile (node:internal/modules/cjs/loader:1126:14)
        at Object.Module._extensions..js (node:internal/modules/cjs/loader:1180:10)
        at Module.load (node:internal/modules/cjs/loader:1004:32)
        at Function.Module._load (node:internal/modules/cjs/loader:839:12)
        at Function.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:81:12)
        at node:internal/main/run_main_module:17:47,
    promise: Promise {
      <rejected> Error: a and b should be numbers
          at /Users/Ruslan/Desktop/Work/timur-shemsedinov/Async-Programming/unhandled-errors-in-promises/6-intercepted.js:8:14
          at new Promise (<anonymous>)
          at sum (/Users/Ruslan/Desktop/Work/timur-shemsedinov/Async-Programming/unhandled-errors-in-promises/6-intercepted.js:4:3)
          at Object.<anonymous> (/Users/Ruslan/Desktop/Work/timur-shemsedinov/Async-Programming/unhandled-errors-in-promises/6-intercepted.js:19:1)
          at Module._compile (node:internal/modules/cjs/loader:1126:14)
          at Object.Module._extensions..js (node:internal/modules/cjs/loader:1180:10)
          at Module.load (node:internal/modules/cjs/loader:1004:32)
          at Function.Module._load (node:internal/modules/cjs/loader:839:12)
          at Function.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:81:12)
          at node:internal/main/run_main_module:17:47
    }
  }
}

  Нам пришёл reason(reason - это экземпляр Error) и внутри него как мы видим есть ошибка
  Так же пришел promise(promise - это экземпляр Promise) а внутри он за реджектин с той же самой ошибкой что и reason
  Почему у нас ошибка повторяется два раза в двух экзеплярах ? Если мы не навесили обработчик на Промис, а кто-то уже вычитал его то с него не так просто выковырять это значение
*/
