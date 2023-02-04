'use strict';

const fs = require('node:fs');

class Thenable {
  constructor() {
    this.thenHandler = null;
    this.next = null;
  }

  then(fn) {
    this.fn = fn;
    const next = new Thenable();
    this.next = next;
    return next;
  }

  resolve(value) {
    const fn = this.fn;
    if (fn) {
      const next = fn(value);
      if (next) {
        next.then(value => {
          this.next.resolve(value);
        });
      }
    }
  }
}

// Usage

const readFile = filename => {
  const thenable = new Thenable();
  fs.readFile(filename, 'utf8', (err, data) => {
    if (err) throw err;
    //читай комментарии ниже, важно понимать что return thenable произойдёт гораздо раньше чем thenable.resolve(data);
    thenable.resolve(data);
  });
  return thenable;
};

(async () => {
  const file1 = await readFile('9-thenable.js');
  console.dir({ length: file1.length });
})();

/*
    Мы можем использовать async await даже в тех случаях когда наш Объект который мы ожидаем - он не асинхронная фция
    У нас есть await readFile('9-thenable.js');
    но сама фция readFile - она абсолютно не асинхронная, более того эта фция возвращает НЕ Промис, а наш await может ожидать асинхронные фции или незарезолвленные промисы(а если зарезолвленные то она значение сразу же отправит в переменную в которую мы await записываем, в нашем случае file1)
    то-есть 
    (async () => {
        const ten = await 10
    })()
    то у нас ten сразу будет 10
    Так же можно упаковать 10 в Промис и оно тоже распакует из Промиса и вернёт нам 10
    (async () => {
        const ten = Promise.resolve => resolve(10)
    })()
    А если бы я написал не разезолвленный Промис то await просто будет его ожидать

    Возвращаясь к примеру то мы можем ожидать await так же Объект
    Наш класс Thenable не имеет ничего такого что бы делало его асинхроным, все методы его синхронны

    у нас return thenable случится гораздо раньше чем thenable.resolve(data);
    те этот thenable не зарезолвленный вернёт вот сюда readFile('9-thenable.js'); и await попробует в нём найти есть ли у него метод then
    и он найдет у объекта thenable произошедшего из класса Thenable() найдёт then и подпишется и перейдёт на работу с коллбеками
    и в then(fn) на место fn наш await пришлёт фцию необходимую что бы подписать на событие
    this.fn = fn; - мы эту фцию сохраняем в свойство нашего Объекта
    const next = new Thenable(); - создадим еще один экземпляр Thenable и это необходимо для того что бы мы могли наш Thenable писать точно так же как и Промис писать по цепочке, то-есть кто-то может начать делать такую же цепочку с awiatами или thenами и нам нужно что бы то что вернулись из метода then тоже было Theable, то-есть мы не можем из then вернуть прям одно значение, 
    мы создаём еще один Thenable и сохраняем его ссылку на next - this.next = next;
    return next; - и возвращаем этот Thenable сюда
    ИТОГО: У нас получился объект который хранит ссылку на подписку когда случится then и еще он хранит пустой thenable и он сам еще не зарезолвлен

    Теперь когда мы вызываем его из этого fs.readFile, мы вызываем thenable.resolve и мы попадаем в resolve
    const fn = this.fn; - мы сохраняем фцию подписки в переменную
    проверяем на ее наличие
    const next = fn(value); - значение которое пришло в resolve отправляем в фцию и помещаем результат ее работы в next и оно это значение это value вылазит из await вот из этого await readFile('9-thenable.js');
    if (next) - если кто-то не будет ждать Thenable с awaitом, а навесит на него .then и из этого .then опять будет возвращаться Промис, асинхроную фцию или что-то вроде этого то мы в const next = fn(value); получим еще один Thenable или Промис и в этот next мы его запишем
    Если next есть то мы подпишему у него на then next.then и у этого then который по цеопчки устанавливается от нас next.then(value мы возьмём value и мы его разезолвим от нешего next то-есть thix.next то-есть пустого next который у нас вот тут заготовлен const next = new Thenable();
    Таким образом если кто-то вместо await readFile('9-thenable.js'); напишет await readFile('9-thenable.js').then и все эти then будут по цепочки возвращать новый Промис и поседний из них тоже вернёт какой-то Промис, то уже этот Промис прийдёт вот в этот await

    Наш Thenable - это упращеный Промис, это очень простой контракт без catch
*/
