'use strict';

// Здесь точно так же как в предыдущем примере, только мы дописали к Фьючеру метод promise - этот метод преобразует Фьючер в Промис. Контракт у них одинаковый - executor, который имеет (resolve, reject) как и у Фьючера и у Промиса

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

  // Мы создаём новый Промис, дальше получаем от Промиса executor с двумя аргументами (resolve, reject), потом вызываем fork нам приходит либо value либо err и мы их после этого отправляем в резолв или реджект к Промисам. То-есть мы еще раз использовали контракт executor с ипользованием шаблона открытого конструктора

  promise() {
    return new Promise((resolve, reject) => {
      this.fork(
        (value) => resolve(value),
        (error) => reject(error)
      );
    });
  }
}

// Usage

// теперь мы можем await применять вместе с Фьючерами - await Future.of(6) , потому что вся эта цепочка на фьючерах(все где map стоит), мы в конце все перегнали в Промисы - .promise() и все что там было от await Future до последнего мепа будет равен уже Промису после того как мы прописали соотвествующий метод, а await уже распаковывает Промис и в value поместит конкретное значение
// Таким образом всю цепочку вычисленей мы сделали чистой благодаря фьючерам и потом приобразовали все это к Промисам

(async () => {
  const value = await Future.of(6)
    .map((x) => {
      console.log('future1 started');
      return x;
    })
    .map((x) => ++x)
    .map((x) => x ** 3)
    .promise();

  console.log('result', value);
})();

/*
future1 started
result 343
*/
