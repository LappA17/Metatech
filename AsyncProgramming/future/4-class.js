'use strict';

// Единственная разница что мы в методе chain() вызываем return new Future
// а в map используем Future.of

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

// Раньше мы задавали Фьючер при помощи открытого конструктора, а сейчас при помощи статического метода of
// то-есть наш of скрывает открытый конструктор

Future.of(6)
  .map((x) => {
    console.log('future1 started');
    return x;
  })
  .map((x) => ++x)
  .map((x) => x ** 3)
  .fork(
    (value) => {
      console.log('future result', value);
    },
    (error) => {
      console.log('future failed', error.message);
    }
  );

/*
future1 started
future result 343
*/
