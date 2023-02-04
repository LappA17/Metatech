'use strict';

// Generator function

function* genFn(x) {
  yield x * 2;
  return x * 3;
}

async function* asyncGenFn(x) {
  yield x * 2;
  return x * 3;
}

const asyncGenFn2 = async function* (x) {
  yield x * 2;
  return x * 3;
};

console.log('asyncGenFn =', [asyncGenFn]);
console.log('asyncGenFn.toString() =', [asyncGenFn.toString()]);
console.log('typeof asyncGenFn =', typeof asyncGenFn);
const fnProto = Object.getPrototypeOf(asyncGenFn);
console.log('fnProto.constructor.name =', fnProto.constructor.name);

console.log('typeof asyncGenFn(5) =', typeof asyncGenFn(5));
console.log('asyncGenFn(5).toString() =', asyncGenFn(5).toString());
const genProto = Object.getPrototypeOf(asyncGenFn(5));
console.log('genProto =', genProto);
console.log('genProto[Symbol.asyncIterator] =', genProto[Symbol.asyncIterator]);

console.log('asyncGenFn(5) =', asyncGenFn(5));
console.log('asyncGenFn(5).next() =', asyncGenFn(5).next());
console.log('asyncGenFn(5).next().value =', asyncGenFn(5).next().value);

/*
asyncGenFn.toString() = [
  'async function* asyncGenFn(x) {\n  yield x * 2;\n  return x * 3;\n}'
]
typeof asyncGenFn = function
fnProto.constructor.name = AsyncGeneratorFunction
typeof asyncGenFn(5) = object
asyncGenFn(5).toString() = [object AsyncGenerator]
genProto = Object [AsyncGenerator] {}
genProto[Symbol.asyncIterator] = [Function: [Symbol.asyncIterator]]
asyncGenFn(5) = Object [AsyncGenerator] {}
asyncGenFn(5).next() = Promise { <pending> }
asyncGenFn(5).next().value = undefined

  Мы видим что у нас есть AsyncGeneratorFunction, его тоже нет в глобальном контексте, но мы можем получить на него ссылку если сделаем асинхронный генератор, и возьмем у него prototypeof потом ссылку на constructor и там будет AsyncGeneratorFunction

  typeof asyncGenFn(5) = object если мы его так вызовим и получим его тип то это будет Объект
  asyncGenFn(5).toString() = [object AsyncGenerator] - из AsyncGeneratorFunction нам возвращается AsyncGenerator

  genProto[Symbol.asyncIterator] = [Function: [Symbol.asyncIterator]] - если мы у прототипа возьмем симбол.итератор то мы получим такой вот нейти код [Function: [Symbol.asyncIterator]] который позволит нам использовать его в for await

  asyncGenFn(5).next() = Promise { <pending> } - при вызове .next() он нам возвращает Промисы

  asyncGenFn(5).next().value = undefined а в next.value() будет undefined потому что у Промисов же нет .value , таким образом мы понимаем что не нужно у асинхронного генератора вызывать .value потому что у него немного другой контракт ! Нужно писать .next().then(и уже как у промиса здесь вынимать какое-то значение)
*/
