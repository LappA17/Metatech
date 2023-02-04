'use strict';

// Всё что делает генератор, это все тот же самый код что и в предыдущих примерах, только чуть меньше нужно кода для написания !

const gen = async function* () {
  let i = 0;
  while (true) {
    if (i >= 3) return;
    yield i++;
  }
};

{
  const iterable = gen();
  const iterator = iterable[Symbol.asyncIterator]();
  const step1 = iterator.next();
  const step2 = iterator.next();
  const step3 = iterator.next();
  const step4 = iterator.next();
  Promise.all([step1, step2, step3, step4]).then((steps) => {
    console.log({ steps });
  });
}

(async () => {
  const iterable = gen();
  for await (const step of iterable) {
    console.log({ step });
  }
})();

/* Смотри как разорвался код
{ step: 0 }
{ step: 1 }
{
  steps: [
    { value: 0, done: false },
    { value: 1, done: false },
    { value: 2, done: false },
    { value: undefined, done: true }
  ]
}
{ step: 2 }
*/
