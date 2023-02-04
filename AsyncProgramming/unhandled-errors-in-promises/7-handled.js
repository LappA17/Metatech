'use strict';

const sum = (a, b) =>
  new Promise((resolve, reject) => {
    if (typeof a === 'number' && typeof b === 'number') {
      resolve(a + b);
    } else {
      reject(new Error('a and b should be numbers'));
    }
  });

// Здесь мы уже обработаем ошибку, и так как пример здесь по-сложнее то мы навесим два обработчика

process.on('unhandledRejection', (reason, promise) => {
  console.log({ unhandledRejection: { reason, promise } });
});

// Почему должно сгенерироваться это событие rejectionHandled, неужели каждый раз когда у нас что-то реджектается то всё это дело приходит в process.on('rejectionHandled') ? Ответ - НЕТ, если мы нормально работаем с Промисами и нормально их резолвим и реджктим, то такое событя случатся не будет.
// Но это событие process.on('rejectionHandled') будет случаться только в одном случае - если система сначала подумала что случился unhandledRejection, а потом передумала и поняла что мы всё таки в коде написали что всё хорошо и обработали эту ошибку

process.on('rejectionHandled', (promise) => {
  console.log({ rejectionHandled: { promise } });
});

// Здесь мы специально доупскаем ошибку, но ниже мы обработку кетча засунули в setTimeout :) , те мы catch оттянули на несколькои мс в сеттаймауте после прокрутки одного евентлупа, но за этот евентлуп Нода решит что мы написали плохой код и у нас нет обработчика и сразу выдаст нам unhandledRejection, но мы потом исправимся и на след цикл этот catch уже будет поставлен и Нода перед нами извинится и скажет что обработчик найден
// В документации Ноды даже сказано что хорошо зависити себе где-то коллекцию этих unhandledRejection, что бы разруливать такую ситуацию, когда Нода говорит что ошибка но на самом деле обработчик catch потом доходит. Из-за того что у нас будет ссылка на Промисы в unhandledRejection то мы потом сможем их сравнивать с Промисами с rejectionHandled и если Промис который пришел в rejectionHandled был в unhandledRejection то мы потом из этой коллекции промисов unhandledRejection его просто удалим и если в unhandledRejection что-то останется после таймаута то уже это будут по настоящему НЕотловленные ошибки

const p1 = sum(7, 'A').then((data) => {
  console.log(data);
});

/* p1.catch((err) => {
  console.log({ catch1: err });
}); */

setTimeout(() => {
  p1.catch((err) => {
    console.log({ catch2: err });
  });
}, 0);

/*
Есди p1.catch закомментирован:
{
  unhandledRejection: {
    reason: Error: a and b should be numbers
        at /Users/Ruslan/Desktop/Work/timur-shemsedinov/Async-Programming/unhandled-errors-in-promises/7-handled.js:8:14
        at new Promise (<anonymous>)
        at sum (/Users/Ruslan/Desktop/Work/timur-shemsedinov/Async-Programming/unhandled-errors-in-promises/7-handled.js:4:3)
        at Object.<anonymous> (/Users/Ruslan/Desktop/Work/timur-shemsedinov/Async-Programming/unhandled-errors-in-promises/7-handled.js:28:12)
        at Module._compile (node:internal/modules/cjs/loader:1126:14)
        at Object.Module._extensions..js (node:internal/modules/cjs/loader:1180:10)
        at Module.load (node:internal/modules/cjs/loader:1004:32)
        at Function.Module._load (node:internal/modules/cjs/loader:839:12)
        at Function.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:81:12)
        at node:internal/main/run_main_module:17:47,
    promise: Promise {
      <rejected> Error: a and b should be numbers
          at /Users/Ruslan/Desktop/Work/timur-shemsedinov/Async-Programming/unhandled-errors-in-promises/7-handled.js:8:14
          at new Promise (<anonymous>)
          at sum (/Users/Ruslan/Desktop/Work/timur-shemsedinov/Async-Programming/unhandled-errors-in-promises/7-handled.js:4:3)
          at Object.<anonymous> (/Users/Ruslan/Desktop/Work/timur-shemsedinov/Async-Programming/unhandled-errors-in-promises/7-handled.js:28:12)
          at Module._compile (node:internal/modules/cjs/loader:1126:14)
          at Object.Module._extensions..js (node:internal/modules/cjs/loader:1180:10)
          at Module.load (node:internal/modules/cjs/loader:1004:32)
          at Function.Module._load (node:internal/modules/cjs/loader:839:12)
          at Function.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:81:12)
          at node:internal/main/run_main_module:17:47
    }
  }
}
{
  catch2: Error: a and b should be numbers
      at /Users/Ruslan/Desktop/Work/timur-shemsedinov/Async-Programming/unhandled-errors-in-promises/7-handled.js:8:14
      at new Promise (<anonymous>)
      at sum (/Users/Ruslan/Desktop/Work/timur-shemsedinov/Async-Programming/unhandled-errors-in-promises/7-handled.js:4:3)
      at Object.<anonymous> (/Users/Ruslan/Desktop/Work/timur-shemsedinov/Async-Programming/unhandled-errors-in-promises/7-handled.js:28:12)
      at Module._compile (node:internal/modules/cjs/loader:1126:14)
      at Object.Module._extensions..js (node:internal/modules/cjs/loader:1180:10)
      at Module.load (node:internal/modules/cjs/loader:1004:32)
      at Function.Module._load (node:internal/modules/cjs/loader:839:12)
      at Function.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:81:12)
      at node:internal/main/run_main_module:17:47
}
{
  rejectionHandled: {
    promise: Promise {
      <rejected> Error: a and b should be numbers
          at /Users/Ruslan/Desktop/Work/timur-shemsedinov/Async-Programming/unhandled-errors-in-promises/7-handled.js:8:14
          at new Promise (<anonymous>)
          at sum (/Users/Ruslan/Desktop/Work/timur-shemsedinov/Async-Programming/unhandled-errors-in-promises/7-handled.js:4:3)
          at Object.<anonymous> (/Users/Ruslan/Desktop/Work/timur-shemsedinov/Async-Programming/unhandled-errors-in-promises/7-handled.js:28:12)
          at Module._compile (node:internal/modules/cjs/loader:1126:14)
          at Object.Module._extensions..js (node:internal/modules/cjs/loader:1180:10)
          at Module.load (node:internal/modules/cjs/loader:1004:32)
          at Function.Module._load (node:internal/modules/cjs/loader:839:12)
          at Function.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:81:12)
          at node:internal/main/run_main_module:17:47
    }
  }
}

Если разкомментируем p1.cactch который сразу кетчим:
{
  catch1: Error: a and b should be numbers
      at /Users/Ruslan/Desktop/Work/timur-shemsedinov/Async-Programming/unhandled-errors-in-promises/7-handled.js:8:14
      at new Promise (<anonymous>)
      at sum (/Users/Ruslan/Desktop/Work/timur-shemsedinov/Async-Programming/unhandled-errors-in-promises/7-handled.js:4:3)
      at Object.<anonymous> (/Users/Ruslan/Desktop/Work/timur-shemsedinov/Async-Programming/unhandled-errors-in-promises/7-handled.js:28:12)
      at Module._compile (node:internal/modules/cjs/loader:1126:14)
      at Object.Module._extensions..js (node:internal/modules/cjs/loader:1180:10)
      at Module.load (node:internal/modules/cjs/loader:1004:32)
      at Function.Module._load (node:internal/modules/cjs/loader:839:12)
      at Function.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:81:12)
      at node:internal/main/run_main_module:17:47
}
{
  catch2: Error: a and b should be numbers
      at /Users/Ruslan/Desktop/Work/timur-shemsedinov/Async-Programming/unhandled-errors-in-promises/7-handled.js:8:14
      at new Promise (<anonymous>)
      at sum (/Users/Ruslan/Desktop/Work/timur-shemsedinov/Async-Programming/unhandled-errors-in-promises/7-handled.js:4:3)
      at Object.<anonymous> (/Users/Ruslan/Desktop/Work/timur-shemsedinov/Async-Programming/unhandled-errors-in-promises/7-handled.js:28:12)
      at Module._compile (node:internal/modules/cjs/loader:1126:14)
      at Object.Module._extensions..js (node:internal/modules/cjs/loader:1180:10)
      at Module.load (node:internal/modules/cjs/loader:1004:32)
      at Function.Module._load (node:internal/modules/cjs/loader:839:12)
      at Function.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:81:12)
      at node:internal/main/run_main_module:17:47
}
  Как мы можем заметить у нас случился catch1 и catch2 и это нормальное состояние когда два раза навешиваем catch на Промис, в этом ничего плохого нет !
  Но как мы видим у нас нет больше сообщений unhandledRejection и rejectionHandled как только появился нормальный обработчик
*/
