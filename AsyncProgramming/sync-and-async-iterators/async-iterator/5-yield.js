'use strict';

const gen = async function* () {
  // точно так же все элементы массива попадут в Промисы, сначала 0 попадёт в Промис и так далее
  yield* [0, 1, 2];
};

//все что написанно ниже - тоже самое что в примере 4

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
/*
{
  steps: [
    { value: 0, done: false },
    { value: 1, done: false },
    { value: 2, done: false },
    { value: undefined, done: true }
  ]
}
  Это то что вернется с Promise.all() и обрати внимание что они вернулись в разных последовательностах
*/

(async () => {
  const iterable = gen();
  for await (const step of iterable) {
    console.log({ step });
  }
})();
/*
{ step: 0 }
{ step: 1 }
{ step: 2 }
  И самое интересное что это вернется раньше чем с Promise.all() !
*/
