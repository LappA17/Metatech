'use strict';

// У нас уже в JS есть протоколы - это нечто похожее на интерфейсы, у нас есть протокол iterable, asyncIterable и еще несколько похожих вещей которые состоят не просто из набора методов, а из конкретного поведения, которое в свой состав включает не только сигнатуры методов или результатов, но и предсказуемую последовательность дейсвтий,

// так вот кроме протоколов очень часто можно встретить такое мнение что как же можно програмировать на JS не имея Интерфейсов, но протокол iterable и является абстрактным интерфейсом, но для JS он проверяется тестами, то-есть мы можем понять насколько  соотвествует реализаций iterable или thenable(на базе этого протокола построенны Промисы), что бы понимать на сколько какой-то объект соотвествует протоколу - мы можем понять только через серию тестов, если и сигнатуры и поведение и все вызовы соотвествуют и тесты проходит то мы понимаем что он полностью соотвествует

// Итератор - это объект с методом next() который возвращает структуру из value и done и мы можем этот next вызывать

const iterator = {
  next() {
    return {
      value: 'value',
      done: false,
    };
  },
};

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

Мы видим что в этом примере всё время происходит done: false, по протоколу итератора считается что итерирование не законченно 

*/
