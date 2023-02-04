'use strict';

// функции внутри Объекта

const powName = 'pow';

const obj1 = {
  fn1: function inc(a) {
    return ++a;
  },
  sum: function (a, b) {
    return a + b;
  },
  inc(a) {
    return ++a;
  },
  max: (a, b) => {
    return a > b ? a : b;
  },
  min: (a, b) => (a < b ? a : b), // а здесь лучше в скобочки взять что бы более понятно где заканчивается лямбда
  dec: (a) => --a, // мы бы могли написать (a) => (--a) но такак как у нас в самом конце стоит запятая --a, то компилятору не будет проблемы понять где на самом деле заканчивается функция
  //в Объект можно добавлять функцию если мы её имя берём в квадратные скобки и имя этой функции будет на powName а значение которое внутри этой функции лежит, а там у нас лежит const powName = 'pow'; те pow будет именем фции
  [powName](a, b) {
    return Math.pow(a, b);
  },
};

console.log('obj1.fn1.name = ' + obj1.fn1.name);
console.log('obj1.sum.name = ' + obj1.sum.name);
console.log('obj1.inc.name = ' + obj1.inc.name);
console.log('obj1.max.name = ' + obj1.max.name);
console.log('obj1.min.name = ' + obj1.min.name);
console.log('obj1.dec.name = ' + obj1.dec.name);

console.log('obj1.fn1(5) = ' + obj1.fn1(5));
console.log('obj1.sum(1, 3) = ' + obj1.sum(1, 3));
console.log('obj1.max(8, 6) = ' + obj1.max(8, 6));

console.log('obj1.pow(8, 6) = ' + obj1.pow(8, 6));
console.log("obj1['pow'](8, 6) = " + obj1['pow'](8, 6)); // так мы прочитаем функцию [powName]
