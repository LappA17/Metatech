'use strict';

// Тут мы расширили наш future добавив коллбек failed в fork
// и еще (error) => reject(error) то-есть если кто-то зарезолвит нам с ошибкой, то мы должны в предыдущий Фьючер эту ошибку передать в его реджект

const future = (executor) => ({
  chain(fn) {
    return future((resolve, reject) =>
      this.fork(
        (value) => fn(value).fork(resolve),
        (error) => reject(error)
      )
    );
  },

  map(fn) {
    return this.chain((value) => future.of(fn(value)));
  },

  fork(successed, failed) {
    executor(successed, failed);
    return this;
  },
});

future.of = (value) => future((resolve) => resolve(value));

// Usage

// мы пробуем запустить future сразу его зареджектив
// и в отличие от Промисов если в Фьючер приходит экземпляр ошибки то он сразу останавливается
// больше не будет никаких мепов, а все это дело сразу передасться с ошибкой и код дальше не пойдет

// На самом деле все 4 Фьючера создадуться, они все будут в цепочки, и у них будет ссылка на executor друг друга(они не ссылку друг на друга имеют, а только ссылку на друг друга executor, по-этому и ет состояние, потому что они не по ссылке друг на друга ссылаются, а только на фцию которая из предыдущего к ним приходит)

future((resolve, reject) => reject(new Error('Rejected')))
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
    future failed Rejected
*/
