'use strict';

//Этот пример будет уже блокирующем
//Если мы делаем асинхронный иттератор и делаем такой вот цикл for await, то по идеи всё должно быть хорошо - нам должно отдаваться время с консоль лога в таймауте, потому что for await же работает с асинхронным контрактом, НО он отдавать не будет ! по той приччине что под for await лежат Promise который сразу резолвится то-есть этот Promise.resolve
//У нас здесь происходит сначала вызов фции asyncIterator, он возвращает Объект, внутри этого Объекта есть фция next, а next уже возвращает зарезолвленный Промис
//Таким образом for await нас не спасает

const range = {
  start: 1,
  end: 1000,
  [Symbol.asyncIterator]() {
    let value = this.start;
    return {
      next: () =>
        Promise.resolve({
          value,
          done: value++ === this.end + 1,
        }),
    };
  },
};

console.dir({
  range,
  names: Object.getOwnPropertyNames(range),
  symbols: Object.getOwnPropertySymbols(range),
});

setTimeout(() => {
  console.log('setTimeout 0');
}, 0);

(async () => {
  const begin = process.hrtime.bigint();
  for await (const number of range) {
    console.log(number);
  }
  const diff = (process.hrtime.bigint() - begin) / 1000000n;
  console.log('Time(ms):', diff.toString());
})();
