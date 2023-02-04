'use strict';

// Convert Promise to callback-last (у нас может быть не фция, а просто экземпляр Промиса, то-есть у нас есть инстенс который кем-то уже сгенерированный и нам бы хотелось этот инстенс привести к функции с контрактом коллбек-ласт)

//(promise) - это инстенс Промиса
//(callback) - возвращается фция с одним аргументом коллбек
const promiseToCallbackLast = (promise) => (callback) => {
  promise
    .then((value) => {
      callback(null, value);
    })
    .catch((reason) => {
      callback(reason);
    });
};

// Usage

//сразу зарезолвленный промис записываем в переменную promise. Если этот Промис будет в пендинг то ничего страшного не произойдёт
const promise = Promise.resolve('value');
//передаём этот промис в фцию с коллбеком
const fnCallbackLast = promiseToCallbackLast(promise);

fnCallbackLast((e, result) => {
  console.dir({ callbackLast: result });
});

const name = 'l';
function getName() {
  console.log(name);
}
getName();
