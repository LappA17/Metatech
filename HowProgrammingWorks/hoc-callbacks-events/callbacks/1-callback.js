'use strict';

// у нас есть две фции, первая которая просто слаживает и вторая которая свой резлуьтат отдает в синхронный коллбек

const add = (a, b) => a + b;
const sum = (a, b, callback) => callback(a + b); // сама фция sum на выходе возвращает undefined. Если бы мы переписали код на { callback(a + b) return undefined } то работало бы точно так же как у нас в примере

console.log('add(5, 2) =', add(5, 2));
sum(5, 2, console.log.bind(null, 'sum(5, 2) =')); // наша фция sum вторым своим аргументом получает фциональный тип, а наш console.log - это у нас частично примененный консоль лог. Почему мы не передаём первым аргументом console.log() ? Потому что мы хотим что бы у нас первый аргумент в консоль логе был 'Sum(5, 2) =', а втррой аргумент уже результат !

const moduless = {
  x: 42,
  getX: function () {
    return this.x;
  },
};

const unboundGetX = module.getX;
console.log(unboundGetX()); // undefined

//const unboundGetX = moduless.getX();
//console.log(unboundGetX); // 42

const boundGetX = unboundGetX.bind(moduless);
console.log(boundGetX());
