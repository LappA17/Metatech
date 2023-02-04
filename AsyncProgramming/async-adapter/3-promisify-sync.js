'use strict';

// Synchronous function to Promise-returning (фцию с синхронным котрактом привеси к Промису)
//fn - это наша синхронная фция
//(...args) => а это поддельная которая умеет возвращать Промисы
const promisifySync =
  (fn) =>
  (...args) => {
    //так как это синхронная фция - то она должна уметь делать throw Error по этому обязательно try catch
    try {
      const result = fn(...args);
      if (result instanceof Error) return Promise.reject(result);
      else return Promise.resolve(result);
    } catch (error) {
      return Promise.reject(error);
    }
  };

// Usage

const twice = (x) => x * 2;
const twicePromise = promisifySync(twice);

const half = (x) => x / 2;
const halfPromise = promisifySync(half);

//это синхронный вызов
const result = half(twice(100));
console.dir({ sync: result });

//асинхронный вызов, точно такой же код как в предыдущим примере
twicePromise(100)
  .then((value) => halfPromise(value))
  .then((result) => {
    console.dir({ promise: result });
  });
