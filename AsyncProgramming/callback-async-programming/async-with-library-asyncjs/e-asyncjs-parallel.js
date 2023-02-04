'use strict';

//в примере с async.map наш map всегда на выходе отдавал нам array, то фция parallel которая тоже объект принимать может и массив, то она для массива отдаст массив а для объект - хеш таблицу

const async = require('async');

console.log('Parallel array of function');

const arr = [
  callback => callback(null, 'uno'),
  callback => callback(null, 'due'),
  callback => callback(null, 'tre'),
];

async.parallel(arr, (err, res) => {
  console.dir({ err, res });
});

console.log('Parallel hash of function');

//Три ключа и их значение - это тоже асинхронные фции
const obj = {
  key1: callback => callback(null, 'uno'),
  key2: callback => callback(new Error('Oh, shit'), 'due'),
  key3: callback => callback(null, 'tre'),
};

async.parallel(obj, (err, res) => {
  console.dir({ error: err.message, res });
});
