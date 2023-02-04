'use strict';

// здесь одна функция(fn) попадает в функцию высшего порядка(logable), а другая из неё возвращается(...args => {})
// logable умеет обернуть фция fn таким способ что бы захватили все аргументы. Дальше саму функцию вызвали со всеми этими аргументами и вывели на экран

const logable =
  (fn) =>
  (...args) => {
    const res = fn(...args);
    console.log(`Call: ${fn.name}(${args.join(', ')}) Result: ${res}`);
    return res;
  };

// Usage

const sum = (a, b) => a + b;

const logableSum = logable(sum);
const a = logableSum(3, 5);
const b = logableSum(7, 2);
const c = logableSum(1, -1);
console.dir({ a, b, c });
