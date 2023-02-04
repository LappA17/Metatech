'use strict';

// Посмотрим как работает обычный js массив

const iterable = [0, 1, 2];

const iterator = iterable[Symbol.iterator](); // мы у array берем [Symbol.iterator] ровно так же как и в предыдущих примерах
const step1 = iterator.next();
const step2 = iterator.next();
const step3 = iterator.next();
const step4 = iterator.next();
console.log({ step1, step2, step3, step4 });

// теперь мы наконец-то понимаем почему for of работает над array - потому что там реализован Symbol.iterator

for (const step of iterable) {
  console.log({ step });
}

console.log({ steps: [...iterable] });
