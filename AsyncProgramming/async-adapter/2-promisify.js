'use strict';

// Callback-last function to Promise-returning (от фции с коллбеками перейти к синхронному контркакту) - мы можем сделать что-то похожее но вернуть не значение, а обещание(Промис) на это значение(потому что коллбек еще ж не вернулся к нам)

//fn - это фция с котрактом callback last - error first
//дальше мы возвращаем фцию (...args) => new Promise и в этом args будет на один аргумент меньше и в неё прийдут те аргументы которые будут нужны для исполнения Промисифицированной фции, только они без коллбека прийдут потому что twicePromise(100).then((value) => halfPromise(value)) мы в промисифицированную фцию twicePromise передаём 100 и без коллбека, а она нам возвращает нам промис и мы уже его обрабатываем через then
const promisify =
  (fn) =>
  (...args) =>
    new Promise((resolve, reject) => {
      //по контракту fn не должна делать throw ошибок, а вместо этого она должна ошибки возвращать в первый аргумент коллбека, в try catch мы ее не оборачиваем потому что мы ей доверяем, хотя можно эту фцию обернуть еще раз в try catch, но по контраакту будем ей доверять и не оборачивать
      fn(...args, (err, data) => {
        if (err) reject(err);
        else resolve(data);
      });
    });

// Usage

const twiceCallback = (x, callback) => {
  callback(null, x * 2);
};
const twicePromise = promisify(twiceCallback);

const halfCallback = (x, callback) => {
  callback(null, x / 2);
};
const halfPromise = promisify(halfCallback);

twiceCallback(100, (e, value) => {
  halfCallback(value, (e, result) => {
    console.dir({ callbackLast: result });
  });
});

//С Промисами получается что мы без коллбека вызываем, передаём нужные аргумента и получаем на выходе промис в value попадает 200 - удовенное значение, дальше мы вызываем еще одну фцию halfPromise которая должная вернуть Промис и второй then уже вызовится НЕ на Промисе twicePromise, а на Промисе halfPromise !
twicePromise(100)
  .then((value) => halfPromise(value))
  .then((result) => {
    console.dir({ promisified: result });
  });
