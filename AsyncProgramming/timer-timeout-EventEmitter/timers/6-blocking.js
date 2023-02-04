'use strict';

//здесь мы делаем все тоже самое что и в 5 примере только мы заготовили себе долгую фцию фибоначи которую наш код будет долго вычеслять const fib = n => (n < 2 ? 1 : fib(n - 1) + fib(n - 2));

const begin = process.hrtime.bigint();

const diff = end => (end - begin) / 1000000n;

//этот таймаут будет вызвана +- через 3 секунды потому что сначало вычислялась фция Фибаначи
setTimeout(() => {
  const end = process.hrtime.bigint();
  console.log('  0: ' + diff(end));
}, 0);

setTimeout(() => {
  const end = process.hrtime.bigint();
  console.log(' 10: ' + diff(end));
}, 10);

setTimeout(() => {
  const end = process.hrtime.bigint();
  console.log(' 20: ' + diff(end));
}, 20);

const fib = n => (n < 2 ? 1 : fib(n - 1) + fib(n - 2));

for (let i = 0; i < 40; i++) fib(i);
