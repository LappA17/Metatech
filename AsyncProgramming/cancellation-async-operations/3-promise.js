'use strict';

// как отменять Промисы ?
// для начала мы от него унаследуемся и переопределим constructor
// у Промисов котракт такой, что туда передается функция executor с двумя аргументами - resolve, reject. Нам Промис должен туда подставить свои функции resolve, reject, а если мы хотим переопределить то мы берём функцию executor(которую нам даст пользователь, вместо new Promise мы ниже в коде пишем new Cancelable) и уже дальше функция с resolve, а именно код выглядит: const promise = new Cancelable((resolve) => { }) и это уже юзер дефайнд функция, и мы ей даём фцию resolve которая унаследовалась от настоящего Промиса

// Как мы это делаем ? При переопределения конструктора мы можем вызывать super() - и это конструктор промиса уже, у него соотвественно тоже будет аргумент executor - и это будет вся эта лямбда от (resolve, reject) => { весь код что тут } и нам родительский Промис даст собственный (resolve, reject)
// дальше мы вызываем executor и нам человек возвращает или val или err(мы err вторым параметром не передаём, а сразу reject) в зависимости от того хочет он делать resolve или reject
// у нас так же есть специальный флаг this.canceled, и если флаг стоит то мы реджектим ошибку и делаем return, а если не стоит то resolve(val)
// И потом в конструкторе только после вызова super() мы можем присвоить this.canceled и важно понимать что эта строчка this.canceled = false; исполнится раньше чем лямбда которую мы передали в super()

// Так же при вызове cancel можно передавать ошибку как это делаем мы reject(new Error('Cancelled')); а можно просто делать return что бы код не пошел к resolve(), но более правильно всё таки выдавать ошибку

class Cancelable extends Promise {
  constructor(executor) {
    super((resolve, reject) => {
      executor((val) => {
        if (this.canceled) {
          reject(new Error('Cancelled'));
          return;
        }
        resolve(val);
      }, reject);
    });
    this.canceled = false;
  }

  cancel() {
    this.canceled = true;
  }
}

// Usage

{
  // мы просто в Cancelable имулируем какуе-то отложенную(асинхронное) опперацию
  const promise = new Cancelable((resolve) => {
    setTimeout(() => {
      resolve('first');
    }, 10);
  });

  //здесь просто ловим этот Промис
  promise.then(console.log).catch(console.log);
  console.dir({ promise });
}

{
  const promise = new Cancelable((resolve) => {
    setTimeout(() => {
      resolve('second');
    }, 10);
  });

  promise.cancel();
  promise.then(console.log).catch(console.log);
  console.dir({ promise });
}

/*
{ promise: Cancelable [Promise] { <pending>, canceled: false } }
{ promise: Cancelable [Promise] { <pending>, canceled: true } }
first
Error: Cancelled
    at /Users/Ruslan/Desktop/Work/timur-shemsedinov/AsyncProgramming/cancellation-async-operations/3-promise.js:19:18
    at Timeout._onTimeout (/Users/Ruslan/Desktop/Work/timur-shemsedinov/AsyncProgramming/cancellation-async-operations/3-promise.js:51:7)
    at listOnTimeout (node:internal/timers:559:17)
    at processTimers (node:internal/timers:502:7)
*/
