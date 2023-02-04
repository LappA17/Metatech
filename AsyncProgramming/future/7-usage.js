'use strict';

const fs = require('node:fs');

// У этого примера есть проблема - файл прочитался 2 раза потому что у нас два форка: size.fork() и lines.fork() и каждой из этих форков вызывал предыдущий future - const future = futureFile('7-usage.js'); и каждый раз отработала фция futureFile а в ней отработала readFile. Эта наша проблема, потому что Future не имеет состояния, а это значит что он не смог закешировать контент этого файла в переменную future вот здесь future - const future = futureFile('7-usage.js'); и каждый раз когда мы вызываем fork - он заново вычесляется !!!
// таким образом у нас есть положительные стороны: пока мы не вызовим метод fork то ли у size то ли у line то никакой файл читаться не будет. Если бы на месте Фьючера был бы Промис, то файл бы в любом случае считался, но результат никуда мы не отправился !!!
// но в теории если нам нужно будет только длину узнать, без кство строк, то-есть fork сделать только на size а lines удалить то тогда файл будет считан только один раз !

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

// Usage

// В этом примере мы уже на практике применим Фьючеры

// фция futureFile возвращает нам Фьючер
// у нас readFile у fs имеет контракт с коллбеком(так же можно с промисом если прописать fs.promises.readFile)
// но мы себе захотели сделать такой readFile(еще мы его назвали futureFile), который будет считывать файл и значения возвращать в Future
// Мы опять же используем конткруто Future - new Future(и все что здесь внутри будет executor) точно так же как это с Промисами, те внутрений код точно такой же как с Промисами мы бы писали, если бы мы вместо new Future прописали бы new Promise все бы работало точно так же, контракты одинаковые

const futureFile = (name) =>
  new Future((resolve, reject) => {
    fs.readFile(name, 'utf8', (err, data) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(data);
    });
  });

// из-за того что у нас кодировка переданная utf8 то нам вернётся строка из которой мы можем получить .length как в size

const future = futureFile('7-usage.js');
const size = future.map((x) => x.length); // мы создадим новый Фьючер, только уже с инфой о длине файла
const lines = future.map((x) => x.split('\n').length); // здесь тоже новый Фьючер из базового Фьючера, только уже с инфой по строкам

size.fork((x) => console.log('File size:', x));
lines.fork((x) => console.log('Line count:', x));

/*
File size: 1745
Line count: 58
*/
