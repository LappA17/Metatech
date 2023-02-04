'use strict';

const fs = require('node:fs');

// Здесь при помощи контракта Thenable реализовали фактически самый простой Промис
// здесь у нас нет onRejected потому что у нас упращенный вариант реализации
// что здесь интересного - что внутри then опять вызывается const next = new Thenable(); - это значит что каждый раз когда кто-то вызываем .then, то создаётся новый экземпляр
// Thenable(как у Промисов) и он уже возвращается. И когда мы будем писать цепочку .then .then .then как ниже и вот в этой реализации Thenable каждый раз будет новый Объект

class Thenable {
  constructor() {
    this.next = null; // next - это будет ссылка на следующий Thenable, который генерируется внутри вызова then в const next = new Thenable();
  }

  then(onSuccess) {
    // на then нам может прийти onSuccess и мы его сохраняем в поле объекта
    this.onSuccess = onSuccess;
    const next = new Thenable();
    // точно так же и новосозданный Thenable мы сохраняем в поле Объекта
    this.next = next; // а вот так связан текущий и следующий Thenable
    // из then возвращаем этот новый(не текущий, а уже следующий) Thenable
    return next;
  }

  // когда у нас резолвится текущий - то нам нужно найти следующий и передать ему информацию что предыдущий уже зарезолвин
  // это нам позволяет что наша новая реализация Thenable может перейти из состояние pending в fullfilled(то-есть разрешиться) только один раз, а следующий раз уже создаст новый Thenable
  resolve(value) {
    // как только кто-то вызывает resolve мы сразу проверяем есть ли у нас такой обработчик onSuccess
    const onSuccess = this.onSuccess;
    if (onSuccess) {
      // если он есть - то мы его вызываем и получаем ссылку на тот же Thenable который он нам вернёт, то-есть onSuccess нам тоже возвращает Thenable
      const next = onSuccess(value);
      if (next) {
        if (next.then) {
          // если он нам вернул Thenable то мы у этого Thenable подписываемся на его then
          next.then((value) => {
            // и передаём это значение, которое в этот then будет приходить,передаём в тот Thenable который мы создали вот тут const next = new Thenable();
            // таким образом у нас внутри Thenable рекурсивно создаётся Thenable и внутри функции readFile ниже каждый раз создаётся такой Thenable
            this.next.resolve(value);
          });
        } else {
          this.next.resolve(next);
        }
      }
    }
  }
}

// Usage

// мы хотим при помощи нашего thenable сделать асинхронный readFile
// в самом начале мы создаём пустой const thenable = new Thenable() и записываем ее в переменную thenable
// дальше вызывает readFile который потом на коллбеки потом вернёт какое-то значение
// и пока он не вернул то мы уже return из этой фции вернём thenable
// и уже кто-то на него подписался при помощи .then()
// как только кто-то подписался - он вызвал метод then, этот метод then создал новый Thenable и кто-то на него опять второй раз подписался .then()
// и здесь получается такая цепочка, список этих Объектов Thenable как Промисы
// и точно так же как и в обычных Промисах внутри .then() мы можем на наш Thenable что-то навешивать, и мы навешиваем return readFile('2-usage.js'); те обычный
// вызов readFile, те мы по цепочки читаем 2 файл, потом 3 файл и тд
// И так как в предполследнем then мы ничего не return то последний then никогда не выполнится

const readFile = (filename) => {
  console.log('start readfile'); // этот консоль лог я сам дописал, его не было в Тимуре коде
  const thenable = new Thenable();
  fs.readFile(filename, 'utf8', (err, data) => {
    console.log('in readFile'); // этот консоль лог я сам дописал, его не было в Тимуре коде
    if (err) throw err;
    thenable.resolve(data);
  });
  console.log('return from readFile'); // этот консоль лог я сам дописал, его не было в Тимуре коде
  return thenable;
};

readFile('1-contract.js')
  .then((data) => {
    console.dir({ file1: data.length });
    return readFile('2-usage.js');
  })
  .then((data) => {
    console.dir({ file2: data.length });
    return readFile('3-class.js');
  })
  .then((data) => {
    console.dir({ file3: data.length });
    return 'I will be printed by callback in the next then'; // then ниже выведит этот текст в консоль
  })
  .then((data) => {
    console.dir({ text: data });
  })
  .then(() => {
    console.log('Will never printed');
  });

/*
start readfile
return from readFile
in readFile
{ file1: 461 }
start readfile
return from readFile
in readFile
{ file2: 890 }
start readfile
return from readFile
in readFile
{ file3: 996 }
{ text: 'I will be printed by callback in the next then' }
*/

/* Таким образом на этом примере мы понимаем что у нас создается очень много лишних контрукций, но Промисы так и работают, насколько мы можем при помощи упращенной реализации в 4 примере мы можем получить все преимущества async/await, единственное что в 4 примере не будет Чейнинга, а один объект имеет изменяемое состояние. И тут нам нужно выбирать что нам использовать: либо такую реализацию как в 9 примере с неизменяемым состоянием, но с большим количеством порождений экземпляров которые сцепляются в такую цепочку через next - это практически односвязный список получается, как-только мы его через then вызываем то у нас сразу строится односвязный список и потом асинхронно исполняется. Либо выбрать как 4 примере что у нас один объект с изменяемым состоянием и в этом и идея что бы облегчить thenable */
