'use strict';

const asyncIterator = {
  counter: 0,
  // нам вернётся Промис и у этого Промиса будет такая структура у которой есть { value, done}
  // то-есть все тоже самое что и в синхронном примере, только из-за того что он объявлен через async то мы получаем Промис
  async next() {
    return {
      value: this.counter++, // current value
      done: this.counter > 3, // boolean
    };
  },
};

const step1 = asyncIterator.next();
const step2 = asyncIterator.next();
const step3 = asyncIterator.next();
const step4 = asyncIterator.next();
console.log({ step1, step2, step3, step4 });

/*
Сразу же зарезолвленные Промисы лежат с каким-то знаечнием
{
  step1: Promise { { value: 0, done: false } },
  step2: Promise { { value: 1, done: false } },
  step3: Promise { { value: 2, done: false } },
  step4: Promise { { value: 3, done: true } }
}
*/
