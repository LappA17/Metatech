'use strict';

// Проблема двух предыдущих примеров что нам нужно было то какой-то цикл крутить и самим проверять случился ли done или много раз next() вызывать
// но самое удобное что мы можем генераторы иттерировать циклом for of

function* ids(...args) {
  // здесь как обычно переменная i и массив args хранятся в контексте фции, те здесь всё как обычно, i на каждой иттерации увеличивается, что-то похожее на замыкание
  let i = 0;
  while (args.length > i) {
    const id = args[i++];
    if (id === undefined) return;
    yield id;
  }
}

const id = ids(1011, 1078, 1292, 1731, undefined, 1501, 1550);
for (const val of id) {
  console.log({ val });
}

/*
{ val: 1011 }
{ val: 1078 }
{ val: 1292 }
{ val: 1731 }
У нас уже появилось 4 числа только мы уже не видим value и done
Цикл for of уже сам внутри вызывает next и возвращает нам уже value и как только done: true мы дальше не пойдём
*/
