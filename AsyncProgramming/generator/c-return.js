'use strict';

function* ids(...args) {
  let i = 0; // индекс по которому мы будем брать элемент в массиве
  while (args.length > i) {
    const id = args[i++];
    if (id === undefined) return;
    yield id;
  }
}

const id = ids(1011, 1078, 1292, 1731, undefined, 1501, 1550);
let val;
do {
  val = id.next();
  console.log({ val });
} while (!val.done);

/*
{ val: { value: 1011, done: false } }
{ val: { value: 1078, done: false } }
{ val: { value: 1292, done: false } }
{ val: { value: 1731, done: false } }
{ val: { value: undefined, done: true } }

    То-есть наша иттерация будет идти пока мы не нактнемся на undefined

    Как можно заметить если мы возвращаем через yield то done будет false, а если через return то true
    И важно так же понимать что генератор сам генерирует этот Объект у которого есть value и done
*/
