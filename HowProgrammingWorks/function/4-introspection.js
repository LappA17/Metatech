'use strict';

// У функции есть аттрибуты(name, valueOf, toString, length(аргументы) и так далее), потому что функция - это Объект

function inc(a) {
  return ++a;
}

const sum = function (a, b) {
  return a + b;
};

const max = (a, b) => (a > b ? a : b);

// получим имя функции(и оно не обязательно будет равно именни индефикитора из которого этот name взяли), потому что функцию можно передать аргументов в другую функцию, она попадёт в другой индификатор, а .name не изменится

console.log('Names: ');
console.dir({
  inc: inc.name,
  sum: sum.name,
  max: max.name,
});

console.log('Arguments: ');
console.dir({
  inc: inc.length,
  sum: sum.length,
  max: max.length,
});

// анонимная фция и у неё name будет пустой потому что мы не присвоили фцию в никакую переменную

console.log(
  'Anonymous function: ' +
    function (x) {
      return x;
    }.name
);
console.log('Anonymous lambda: ' + ((x) => x).name);

// метод toString выдает исходный код нашей фции

console.log('toString: ');
console.dir({
  inc: inc.toString(),
  sum: sum.toString(),
  max: max.toString(),
});

// в js функции - это объекты первого класса, у них есть методы, они наследуются от объекта и одна фция может передаваться в другую и тд
