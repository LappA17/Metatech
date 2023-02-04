'use strict';

// Здесь мы склеем наше понимания iterator и iterable с синхронным Генератором
// всё тоже самое что мы делали при помощи этих контрактов - мы можем задать благодаря Генератору

const gen = function* () {
  let i = 0;
  while (true) {
    if (i >= 3) return;
    yield i++;
  }
};

{
  const iterable = gen();
  //обрати внимание что мы Генератору нигде Symbol.iterator не задавали !
  const iterator = iterable[Symbol.iterator](); // не знаю почему но если я удалю этот [Symbol.iterator]() и оставлю просто iterable то результат будет тот же самый
  const step1 = iterator.next();
  const step2 = iterator.next();
  const step3 = iterator.next();
  const step4 = iterator.next();
  console.log({ step1, step2, step3, step4 });
}

{
  const iterable = gen(); // генератор возвращает нам итерабл !
  for (const step of iterable) {
    console.log({ step });
  }
}

{
  const iterable = gen();
  console.log({ steps: [...iterable] });
}

/*
{
  step1: { value: 0, done: false },
  step2: { value: 1, done: false },
  step3: { value: 2, done: false },
  step4: { value: undefined, done: true }
}
{ step: 0 }
{ step: 1 }
{ step: 2 }
{ steps: [ 0, 1, 2 ] }
*/
