'use strict';

// Здесь будет такая же самая штука, только без Миксина, но мы оставим замыкание
// мы вместо того что бы примешивать фцию cancelled к Промису мы делаем объект с двумя полями { promise, cancel }
// в promise помещаем следующий Промис(то-есть promise.then)

const cancelable = (promise) => {
  let cancelled = false;
  return {
    promise: promise.then((val) => {
      if (cancelled) return Promise.reject(new Error('Canceled'));
      return val;
    }),
    cancel: () => {
      cancelled = true;
    },
  };
};

// Usage

// В cancelable передается new Promise и мы снаружи имеем благодаря диструктуризации { cancel, promise }

{
  const { cancel, promise } = cancelable(
    new Promise((resolve) => {
      setTimeout(() => {
        resolve('first');
      }, 10);
    })
  );

  promise.then(console.log).catch(console.log);
  console.dir({ cancel, promise });
}

// и фция cancel через замыкание связанна с Промисом ! и она понимает какой именно промис она отменяет !

{
  const { cancel, promise } = cancelable(
    new Promise((resolve) => {
      setTimeout(() => {
        resolve('second');
      }, 10);
    })
  );

  cancel();
  promise.then(console.log).catch(console.log);
  console.dir({ cancel, promise });
}
