/* -------------------- */
/** Таймаут на промисах */
/* -------------------- */
const asyncTimeout = ms =>
  new Promise(resolve => {
    setTimeout(() => {
      console.log(ms);
      resolve();
    }, ms);
  });

/* --------------------- */
/** Таймаут на коллбэках */
/* --------------------- */
const callbackTimeout = (ms, cb) => {
  setTimeout(() => {
    console.log(ms);
    if (cb) {
      cb();
    }
  }, ms);
};

/* ---------------------------------------- */
/** Последовательное выполнение на промисах */
/* ---------------------------------------- */
(async () => {
  const start = performance.now();
  await timeout(3000);
  await timeout(2000);
  await timeout(1000);

  console.log(performance.now() - start);
})();

/* ----------------------------------------- */
/** Последовательное выполнение на коллбэках */
/* ----------------------------------------- */
(async () => {
  const start = performance.now();

  callbackTimeout(3000, () => {
    callbackTimeout(2000, () => {
      callbackTimeout(1000, () => {
        console.log(performance.now() - start);
      });
    });
  });
})();

/* ------------------------------------ */
/** Параллельное выполнение на промисах */
/* ------------------------------------ */
(async () => {
  const start = performance.now();
  await Promise.all([timeout(3000), timeout(2000), timeout(1000)]);
  console.log(performance.now() - start);
})();

/* ---------------------------------------------------------------------------------------- */
/** Параллельное выполнение на промисах (другой вариант записи, аналог предыдущего примера) */
/* ---------------------------------------------------------------------------------------- */
(async () => {
  const start = performance.now();
  const promise1 = asyncTimeout(3000);
  const promise2 = asyncTimeout(2000);
  const promise3 = asyncTimeout(1000);

  await Promise.all([promise1, promise2, promise3]);

  console.log(performance.now() - start);
})();

/* ------------------------------------- */
/** Параллельное выполнение на коллбэках */
/* ------------------------------------- */
(async () => {
  const start = performance.now();

  // Передаю log только сюда, т.к. эта функция будет выполняться дольше всех, и она будет завершающей
  callbackTimeout(3000, () => console.log(performance.now() - start));
  callbackTimeout(2000);
  callbackTimeout(1000);
})();
