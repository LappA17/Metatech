'use strict';

const add = (x) => (y) => {
  const z = x + y;
  console.log(`${x} + ${y} = ${z}`);
  return add(z); // этот z попадёт на место x и в результате наш return вернёт фцию, которая будет иметь один аргумент - это y
  // такая вот конструкция по цепочке позволит писать много-много вызовов
};

// const add = x => y => add(x + y); // та же самая фция только в одну строчку

// Usage

const a1 = add(5);
const a2 = a1(2);
const a3 = a2(3);
const a4 = a1(1); // у нас до сих пор есть ссылка на а1
const a5 = a2(10);
console.log(a1, a2, a3, a4, a5);

const res = add(5)(2)(3)(7);
console.log(res);

/*
[Running] node "/Users/Ruslan/Desktop/Work/0-timur-shemsedinov/HowProgrammingWorks/closure/tempCodeRunnerFile.js"
5 + 2 = 7
7 + 3 = 10
5 + 1 = 6
7 + 10 = 17
[Function (anonymous)] [Function (anonymous)] [Function (anonymous)] [Function (anonymous)] [Function (anonymous)]
5 + 2 = 7
7 + 3 = 10
10 + 7 = 17
[Function (anonymous)]

Что это за Function anonymous ? Это значит что изнутри вот из этого консоль лога console.log(`${x} + ${y} = ${z}`); мы можем достучаться к суме x и y, а из-вне уже нет, то-есть консоль лог console.log(a1, a2, a3, a4, a5); и console.log(res); уже их не напечатает
*/
