'use strict';

// При помощи метода next() благодаря которому мы вынимаем из Генератора следующее значение, мы можем и отпрвлять какое-то значение во-внутрь Генератора обратно

function* counter(begin, end, delta) {
  let value = begin;
  while (end > value) {
    value += delta;
    const back = yield value; // здесь мы предыдущий value отдаёт наружу
    if (back) value += back;
    console.log({ back });
  }
}

const c = counter(0, 30, 12);
const val1 = c.next();
const val2 = c.next();
const val3 = c.next(150); // откуда у нас этот 150 вылазит ? Из yield. Наш next() 150 запишется в cosnt back. Но так как у нас в val1 и val2 фция next() передается без аргументов - это значит что yield вернёт undefined и этот back на двух первых вызовах будет undefined и того if не будет, а если приходит значение в next то мы попадём в if
const val4 = c.next();
console.log({ c, val1, val2, val3, val4 });

/*
{ back: undefined }
{ back: 150 }
{
  c: Object [Generator] {},
  val1: { value: 12, done: false },
  val2: { value: 24, done: false },
  val3: { value: undefined, done: true },
  val4: { value: undefined, done: true }
}
*/
