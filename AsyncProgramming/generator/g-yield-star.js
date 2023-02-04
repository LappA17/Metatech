'use strict';

// Возврат из Генератора через yield со звёздочкой *
// в такой yield* мы можем возвращать другие иттерированные объекты(в данном случае мы вернём массив, но можем и Set потому что внутри массива и Set есть Символ.иттератор который мы заберём и его будем возвращать через yeild*).
// Если без звёздочки писать то сам массив и вернётся в value, а со звёздочкой уже сам начнет и иттерироваться

function* genFn() {
  yield* [10, 20, 30];
  //yield* new Set([10, 20, 30]);
}

const c = genFn();
const val1 = c.next();
const val2 = c.next();
const val3 = c.next();
const val4 = c.next();
console.log({ c, val1, val2, val3, val4 });

/*
yield*
Массив начал иттерироваться 
{
  c: Object [Generator] {},
  val1: { value: 10, done: false },
  val2: { value: 20, done: false },
  val3: { value: 30, done: false },
  val4: { value: undefined, done: true }
}

yield
Вернулся сам массив
{
  c: Object [Generator] {},
  val1: { value: [ 10, 20, 30 ], done: false },
  val2: { value: undefined, done: true },
  val3: { value: undefined, done: true },
  val4: { value: undefined, done: true }
}
*/
