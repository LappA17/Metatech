'use strict';

const iterable = {
  [Symbol.asyncIterator]() {
    let i = 0;
    const iterator = {
      async next() {
        return {
          value: i++,
          done: i > 3,
        };
      },
    };
    return iterator;
  },
};

// Usage

const iterator = iterable[Symbol.asyncIterator]();
const step1 = iterator.next();
const step2 = iterator.next();
const step3 = iterator.next();
const step4 = iterator.next();
console.log({ step1, step2, step3, step4 });

// for await - работает ! Но spread опператор уже НЕ расскрывается

(async () => {
  for await (const step of iterable) {
    console.log({ step });
  }
})();

/*
{
  step1: Promise { { value: 0, done: false } },
  step2: Promise { { value: 1, done: false } },
  step3: Promise { { value: 2, done: false } },
  step4: Promise { { value: 3, done: true } }
}
Обратни внимание что for await уже расспаковывает из Промисов нам эти значения !
{ step: 0 }
{ step: 1 }
{ step: 2 }
*/
