'use strict';

// Pending

const promise1 = new Promise(resolve => {
  setTimeout(() => {
    resolve('value1');
  }, 0);
});
console.dir({ promise1 }); // Promise { <pending> } то-есть наш промис не зарезолвин
promise1.then(console.log); // 'value1' (delayed) здесь мы уже подписываемся, что бы когда значение появилось то наш Промис вызвался, а delayed Тимур написал потому что этот промис выполнится одним из последих, потому что там setTimeout

// Immediate resolve

const promise2 = new Promise(resolve => resolve('value2'));
console.dir({ promise2 }); // Promise { 'value2' }
promise2.then(console.log); // 'value2'

// Immediate reject

const promise3 = new Promise((resolve, reject) => {
  reject(new Error('I have no value for you'));
});
console.dir({ promise3 }); // Promise { <rejected> Error... }
promise3.then(console.log).catch(console.log); // Error...

// Promise.resolve

const promise4 = Promise.resolve('value4');
console.log({ promise4 }); // Promise { 'value4' }
promise4.then(console.log); // 'value4'
// Здесь уже пример с шортхендом, то-есть мы сразу резолвим Промис, иногда нам нужно просто что бы контракты совпадали, иногда мы можем передавать как Пендинг Промис, так и уже Зарезолвленый. Обрати внимание что в консольлоге уже значение имеется, и не смотря на то что мы подписываемся на зарезорвленный Промис, то оно всё равно отработает !

// Promise.reject

const promise5 = Promise.reject(new Error('I have no value for you'));
console.dir({ promise5 }); // Promise { <rejected> Error... }
promise5.then(console.log).catch(console.log); // Error...

// Example with I/O ввод/вывод

const fs = require('node:fs');

const readFile = (filename, encoding) =>
  new Promise((resolve, reject) =>
    //здесь фция возвращает свое значение в передаваемый коллбек третим аргументом в (err, data)
    //мы этот readFile оборачиваем в Промисы
    fs.readFile(filename, encoding, (err, data) => {
      if (err) reject(err);
      else resolve(data.toString()); //из буффера приобразовываем в строку и резолвим
    })
  );

readFile('file1.txt', 'utf8')
  .then(data => {
    console.log(data);
    return readFile('file2.txt', 'utf8'); // возвращает следующий промис, по-этому мы можем ниже еще раз then написать. То-есть мы делаем некий Чейнинг
  })
  .then(data => {
    console.log(data);
    return readFile('file3.txt', 'utf8');
  })
  .then(data => {
    console.log(data);
  });

/*
    Вот это называется лямбдой:
        resolve => {
        setTimeout(() => {
            resolve('value1');
        }, 0);
    }
    это то что мы передаём в new Promise 

    У нас здесь в примерах все происходит паралельно, по-этому нет наростание в памяти 
*/
