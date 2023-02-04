'use strict';

const fs = require('node:fs');

class Future {
  constructor(executor) {
    this.executor = executor;
  }

  static of(value) {
    return new Future((resolve) => resolve(value));
  }

  chain(fn) {
    return new Future((resolve, reject) =>
      this.fork(
        (value) => fn(value).fork(resolve, reject),
        (error) => reject(error)
      )
    );
  }

  map(fn) {
    return this.chain((value) => Future.of(fn(value)));
  }

  fork(successed, failed) {
    this.executor(successed, failed);
  }
}

// точно так же как мы писали promisify мы напишем futurify - то-есть мы сделаем такой конверт, который может приобразовывать контракты асинхронности
// мы напишем такой futurify который нам позволит приобразовать фцию readFile из вот такого контракта с коллбеками (name, callback) => fs.readFile(name, 'utf8', callback); в контракт с Фьючерами. То-есть futurify принимает фцию коллбек, а возвращает фию с фьючерами, те она приобразовывает контракты
// делает она это при помощи обёртки, на вход принимается фция (fn) с контрактов коллбек ласт - еррор фёрст, и возращается новая фция(у нас лямбда внтутри лямбды), и внутри этой новой фции есть expresion -> сначала new Future и дальше пошел executor
// тут мы сначала вызываем фцию с контрактом с коллбеком - fn() , потом захватить все её аргумнеты ...args и расспаковать их, и потом мы ей передаемм коллбек ласт - еррор фёрст,

const futurify =
  (fn) =>
  (...args) =>
    new Future((resolve, reject) => {
      fn(...args, (err, data) => {
        if (err) reject(err);
        else resolve(data);
      });
    });

// Usage

const readFile = (name, callback) => fs.readFile(name, 'utf8', callback);
const futureFile = futurify(readFile);

futureFile('8-futurify.js')
  .map((x) => x.length)
  .fork((x) => console.log('File size:', x));

// ИТОГ: Мы получуили новую асбтракцию асинхронности, при помощи которой мы можем делать цепочки вычислений, которые в отличие от просто Монад у нас асинхронные цепочки вычислений
