'use strict';

// Promise-returning function callback-last / error-first (здесь мы от промисов обратно возвращаемся к коллбеками)

//fn - это либо обычная фция которая возвращает промисы, либо асинронная фция объявлена с словом async
//(...args) => { - эта фция нам возвращается из callbackify, и здесь будет обычная фция асинхронного контракта callback-last / error-first
const callbackify =
  (fn) =>
  (...args) => {
    //из неё точно так же забираем коллбек как раньше
    const callback = args.pop();
    //вызовим её а та в свою очередь вернёт нам Промис
    fn(...args)
      .then((value) => {
        callback(null, value);
      })
      .catch((reason) => {
        callback(reason);
      });
  };

// Usage

const twicePromise = (x) => Promise.resolve(x * 2);
const twiceCallback = callbackify(twicePromise);

const halfPromise = (x) => Promise.resolve(x / 2);
const halfCallback = callbackify(halfPromise);

//здесь фция НЕприобразованная, а в предыдущих примерах была приобразованной
twicePromise(100)
  .then((value) => halfPromise(value))
  .then((result) => {
    console.dir({ promise: result });
  });

//мы теперь тестируем приобразованную фцию с коллбеком
twiceCallback(100, (e, value) => {
  halfCallback(value, (e, result) => {
    console.dir({ callbackLast: result });
  });
});
