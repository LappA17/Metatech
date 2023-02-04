'use strict';

// В 3 примере мы унаследовались от Промиса, а здесь уже сделаем фцию wrapper, только уже для Промисов

// У нас создается два промиса, они связываются в цепочку, есть примись в виде next.cancel и замыкание есть
const cancelable = (promise) => {
  let cancelled = false; // флаш canceled уже не будет свойством класса, а будем в замыкание держать
  // мы подписываемся на then этого Промиса
  // и в этом next будет уже новый Промис, те тут два Промиса и они связанные в цепочку
  // и как только на этом Промисе приходит какой-то then, то мы проверяем на флаг if (cancelled)
  // а если cancelled = false то мы вернем val из предыдущего Промиса, который еще в этот next отправялем
  const next = promise.then((val) => {
    if (cancelled) return Promise.reject(new Error('Canceled'));
    return val;
  });
  // Промису next примешали метод cancel
  next.cancel = () => {
    cancelled = true;
  };
  return next;
};

// Usage

{
  //мы создаём экземпляр Промиса(эта та лямба которая передаётся в cancelabel, те все что внутри круглых скобок cancelable() от new Promise и до конца)
  const promise = cancelable(
    new Promise((resolve) => {
      setTimeout(() => {
        resolve('first');
      }, 10);
    })
  );

  promise.then(console.log).catch(console.log);
  console.dir({ promise });
}

{
  const promise = cancelable(
    new Promise((resolve) => {
      setTimeout(() => {
        resolve('second');
      }, 10);
    })
  );

  promise.cancel();
  promise.then(console.log).catch(console.log);
  console.dir({ promise });
}
