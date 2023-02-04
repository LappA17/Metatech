'use strict';

// Когда мы по-дефолту задаёт какое-то значение то нашему Компилятору будет уже легче оптимизировать наш код. Наш v8 умеет догадываться если задать тип значение по умолчанию

// ES6 style for default parameter values
//
function fnNew(a, b = 'Hello', c = 5) {
  console.dir({ a, b, c });
}

fnNew(1, 2, 3);
fnNew(1, 2);
fnNew(1);
fnNew();

// Old style for default parameter values
//
function fnOld(a, b, c) {
  b = b || 'Hello';
  c = c || 5;
  console.dir({ a, b, c });
}

fnOld(1, 2, 3);
fnOld(1, 2);
fnOld(1);
fnOld();

// Hash style for default parameter values
// Такой подход иногда нужен когда мы пишем код связанный с предметоной областью, в системно коде такое лучше не писать
// таким образом передавая аргументы в виде объекта мы можем передавать в любой последовательности
function fnHash(args) {
  args.a = args.a || [7, 25, 10];
  args.b = args.b || 'Hello';
  args.c = args.c || 100;
  console.dir(args);
}

fnHash({ a: [1, 2, 3], b: 'Hi', c: 3 });
fnHash({ b: 'World' });
fnHash({ c: 7 });
