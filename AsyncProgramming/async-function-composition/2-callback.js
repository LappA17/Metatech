'use strict';

// Если мы это будем делать с callbackами, то у нас будет две функции(в нашим примере это функции inc и twice) которые обе имеют контракт callback last error first.
// если бы функции были бы нечистыми то нам нужно было бы первым аргументов возвращать ошибку к примеру, а в нашем случае мы передаём null

// У нас в compose приходит две функции(в нашем случае inc и twice) и они возвращают еще одну функцию с таким же самым контрактом (x, callback) те у нас аргумент идёт первым аргументом, а коллбек вторым
// потом сначала вызывается f1 и у него callback навешан на результаты
// и дальше вызывается f2 и у него тоже callback навешан на результаты - f2(res, callback);
// так же мы еще сразу проверяем на ошибку

const compose = (f1, f2) => (x, callback) => {
  f1(x, (err, res) => {
    if (err) {
      callback(err);
      return;
    }
    f2(res, callback);
  });
};

// Usage

const inc = (x, callback) => callback(null, x + 1);
const twice = (x, callback) => callback(null, x * 2);

const f = compose(inc, twice);

f(7, (err, res) => {
  console.log({ res });
});

// { res: 16 }
