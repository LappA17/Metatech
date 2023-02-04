'use strict';

// Implementation

const adder = (value) => {
  const add = (a) => {
    value += a;
    if (value >= add.maxValue) {
      setImmediate(() => {
        const err = new Error('max value reached');
        add.maxEvent(err, value);
      });
    }
    return add;
  };
  // callback-last
  add.max = (max, event) => {
    add.maxValue = max;
    add.maxEvent = event;
    return add;
  };
  return add;
};

// Usage

// здесь уже контракт изменился, может прийти как и ошибка так и значение

// error-first
const maxReached = (err, value) => {
  if (err) throw err;
  console.log('value:', value);
};

// если в течение кода ниже произойдет какая-то синхронная ошибка(а try умеет ловить синхронные ошибки), а у нас adder написам асинхронно, потому что там setImmediate и весь код в этой лямбде setImmediate как и ошибка будут асинхронные и мы НЕ можем эту ошибку при помощи try catch перехватить, потому что try catch только синхронные ошибки может ловить !!! И тимур специально написал console.log('Never'); в catch потому что эта строчка никогда не исполнится

try {
  const a1 = adder(10).max(100, maxReached)(-5);
  a1(25);
  a1(50);
  a1(75);
  a1(100);
  a1(-200)(50)(30);
} catch (e) {
  console.log('Never');
}

console.log('end');
