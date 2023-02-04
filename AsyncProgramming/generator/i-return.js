'use strict';

// у Генератора есть вда не нужных метода return и в следующем примере throw. Мы можем вместо метода next вызвать return со значением и это значение станет value и оно вернётся нам из генератор

function* genFn() {
  yield 10;
  yield 20;
  yield 30;
}

{
  const g = genFn();
  const val1 = g.next();
  const val2 = g.next();
  const val3 = g.next();
  const val4 = g.return(40);
  console.log({ val1, val2, val3, val4 });
}

{
  const g = genFn();
  const val1 = g.next();
  const val2 = g.return(40);
  const val3 = g.next();
  const val4 = g.return(50);
  console.log({ val1, val2, val3, val4 });
}

/*
{
  val1: { value: 10, done: false },
  val2: { value: 20, done: false },
  val3: { value: 30, done: false },
  val4: { value: 40, done: true }
}
{
  val1: { value: 10, done: false },
  val2: { value: 40, done: true },           Как только return сделали то этот генератор вернул true 
  val3: { value: undefined, done: true },    потом скажет на next что он закончился
  val4: { value: 50, done: true }            и если опять вызовем return то вернул value которое мы передали в return
}
*/
