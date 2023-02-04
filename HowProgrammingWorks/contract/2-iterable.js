'use strict';

// Здесь мы из протокола iterator сделаем протокол iterable - это надстройка над iterator.
// iterable - это когда у Объекта есть Symbol.iterator и он уже возвращает некоторый объект который соотвествует протоколу iterable
// когда мы описываем такой протокол, то мы создаём некоторый контракт которому должны соотвестовавать все объекты у которых определён Symbol.iterator

// Контракт - это что-то очень похожее на протокол, но Контракт - это что-то более широкое чем интерфейс, потому что здесь кроме соблюдения типов должны соблюдаться вложенности и модель поведения

const iterable = {
  [Symbol.iterator]() {
    return {
      next() {
        return {
          value: 'value',
          done: false,
        };
      },
    };
  },
};

const iterator = iterable[Symbol.iterator]();

const item1 = iterator.next();
console.dir({ item1 });

const item2 = iterator.next();
console.dir({ item2 });

const item3 = iterator.next();
console.dir({ item3 });

/*
{ item1: { value: 'value', done: false } }
{ item2: { value: 'value', done: false } }
{ item3: { value: 'value', done: false } }
*/
