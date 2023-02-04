'use strict';

let count = 0;
const arr = [7, 10, 1, 5, 2];
const sum = (acc, val) => (count++, acc + val); // здесь место блока функции {} у нас экспрешен, первый элемент будет добавлять каунтер, второй сумировать. В таком виде записи экспршенеа только самое последнее выражение после запятой будет как результат работы функции, все что перед будет просто что-то менять снаружи или еще что-то там !!
const res = arr.reduce(sum);
console.log({ res, count });

// руками напишем reduce

const reduce = (fn, acc, [cur, ...rest]) =>
  cur === undefined ? acc : reduce(fn, fn(acc, cur), rest);

const res2 = reduce(sum, 0, arr);
console.log({ res2 });
