'use strict';

// iterable - контракт который уже чуть сложнее, у него(или его прототипа) объявленно поле Symbol.iterator, которое в свою очередь возвращает iterator

const iterable = {
  [Symbol.iterator]() {
    let i = 0;
    const iterator = {
      next() {
        return {
          value: i++,
          done: i > 3, //если здесь подставить другое слово, например не done, а don(или любое другое слово) то у нас будет бесконечное иттерация, а так done на сколько я понял - это зарезервованное слово и как только done в true иттерация дальше не пойдёт
        };
      },
    };
    return iterator;
  },
};

// Usage

const iterator = iterable[Symbol.iterator](); //мы берём свойство Symbol.iterator у объекта iterable и вызываем его как функцию ()
const step1 = iterator.next();
const step2 = iterator.next();
const step3 = iterator.next();
const step4 = iterator.next();
console.log({ step1, step2, step3, step4 });

// Если объект - iterable, то у него есть возможность быть 1) пройденным циклом 2) развернутым с помощью spread опператором

for (const step of iterable) {
  console.log({ step });
}

console.log({ steps: [...iterable] });

/*
{
  step1: { value: 0, done: false },
  step2: { value: 1, done: false },
  step3: { value: 2, done: false },
  step4: { value: 3, done: true }
}
{ step: 0 }
{ step: 1 }
{ step: 2 }
{ steps: [ 0, 1, 2 ] }
*/
