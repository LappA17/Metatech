'use strict';

// в конце урока подэтожим что такое Генератор - это фция которая можем несколько раз возвращать какое-то значение из себя, потом когда мы вызываем следующий раз next то выполнение выполняется с той же самой строчки с которой мы вернули предыдущее значение

// Генератор - это особый вид функций, они помечены звёздечкой(function* genFn(x) {}), а асинхронные генераторы помечены ключевым словом async и тоже звёздочкой
// Мы можем объявить фцию генерато через delcaration и через expression
// Генераторы по ходу своей работы могут несколько раз вернуть какое-то значение, у них сохарняется контекст, но значение вернуть могут не один раз а несколько, последний раз они делают это return и до этого через ключевое слово yield(или yield со звездочкой)

// Generator function

function* genFn(x) {
  yield x * 2;
  return x * 3;
}

console.log('genFn =', [genFn]);
console.log('genFn.toString() =', [genFn.toString()]);
console.log('typeof genFn =', typeof genFn);
const fnProto = Object.getPrototypeOf(genFn);
console.log('fnProto.constructor.name =', fnProto.constructor.name);

console.log('typeof genFn(5) =', typeof genFn(5));
console.log('genFn(5).toString() =', genFn(5).toString());
const genProto = Object.getPrototypeOf(genFn(5));
console.log('genProto =', genProto);
console.log('genProto[Symbol.iterator] =', genProto[Symbol.iterator]); // здесь мы у прототипа берем ссылку на иттератор

console.log('genFn(5) =', genFn(5));
console.log('genFn(5).next() =', genFn(5).next());
console.log('genFn(5).next().value =', genFn(5).next().value);

// Generator class method

class Multiplier {
  constructor(k) {
    this.value = k;
  }

  *genMethod(a) {
    yield this.value;
    this.value *= a;
    return this.value;
  }
}

const m1 = new Multiplier(2);
console.log('m1.genMethod(5).next() =', m1.genMethod(5).next());

// Generator object field

const m2 = {
  value: 2,

  *genMethod(a) {
    yield this.value;
    this.value *= a;
    return this.value;
  },
};

console.log('m2.genMethod(5).next() =', m2.genMethod(5).next());

/*
genFn = [ [GeneratorFunction: genFn] ]
genFn.toString() = [ 'function* genFn(x) {\n  yield x * 2;\n  return x * 3;\n}' ]
typeof genFn = function
fnProto.constructor.name = GeneratorFunction
typeof genFn(5) = object
genFn(5).toString() = [object Generator]
genProto = Object [Generator] {}
genProto[Symbol.iterator] = [Function: [Symbol.iterator]]
genFn(5) = Object [Generator] {}
genFn(5).next() = { value: 10, done: false }
genFn(5).next().value = 10
m1.genMethod(5).next() = { value: 2, done: false }
m2.genMethod(5).next() = { value: 2, done: false }

Во-первых мы видим что сам генератор - это вот такая вот штука genFn = [ [GeneratorFunction: genFn] ], то-есть класс GeneratorFunction который не доустпен нам в глобальном контексте

toString нам возвращает его тело enFn.toString() = [ 'function* genFn(x) {\n  yield x * 2;\n  return x * 3;\n}' ], точно так же тело фции toString вернёт и у обычной фции

typeof genFn = function генератор - это обычная функция, те GeneratorFunction наследует у function и реализует несколько своих интерфейсов

fnProto.constructor.name = GeneratorFunction - у прототипа constructor.name будет GeneratorFunction, те теперь мы знаем что constructor будет ссылаться на сам класс GeneratorFunction

typeof genFn(5) = object - генератор возвращает обычный объект

genFn(5).toString() = [object Generator] в toString уже будет [object Generator], те мы уже увидели что там есть GeneratorFunction и этот GeneratorFunction вовзаращает объект Generator
genProto = Object [Generator] {} и когда мы берёт прототип то получает этот Object [Generator] и хоть в нём ничего не видно {} но 
genProto[Symbol.iterator] = [Function: [Symbol.iterator]] у него есть свойство Symbol.iterator] где у нас лежит иттератор

genFn(5).next() = { value: 10, done: false } и если у него вызвать .next() то получим объект с двумя полями { value: 10, done: false }
genFn(5).next().value = 10 - это двойка умноженная на 5

{ done: true } - будет тогда когда закончится иттерирование
*/
