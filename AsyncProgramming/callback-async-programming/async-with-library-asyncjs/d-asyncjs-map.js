'use strict';

const async = require('async');

console.log('Map array');

const arr = [1, 2, 3, 4];

//массив передаем первым аргументов, вторым - фция через которую этот массив будет обробатываться и третьим - отправляем результат
async.map(
  arr,
  (item, callback) => {
    console.dir({ item });
    callback(null, item * 2);
  },
  (err, res) => {
    console.dir({ err, res });
  }
);

//Такой же пример написанный через Объект
//результат будет тот же самый что и с массивом если мы специально не будем допускать ошибки

console.log('Map object');

const obj = { a: 1, b: 2, c: 3, d: 4 };

async.map(
  obj,
  (item, callback) => {
    console.dir({ item });
    if (item === 2) callback(new Error('Oh, shit'), 'value');
    else callback(null, item * 2);
  },
  (err, res) => {
    console.dir({ error: err.message, res });
  }
);

/*

Map array
{ item: 1 }
{ item: 2 }
{ item: 3 }
{ item: 4 }
{ err: null, res: [ 2, 4, 6, 8 ] }
Map object
{ item: 1 }
{ item: 2 }
{ error: 'Oh, shit', res: [ 2, 'value' ] }

*/
