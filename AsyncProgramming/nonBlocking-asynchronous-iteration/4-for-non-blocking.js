'use strict';

//Если во втором примере мы сделали неблокирующий но очень медленный, то здесь сделаем на подобном синтаксисе как в 3 примере только неблокирующий
//Хоть мы в этом примере все реализовали через асинхронный иттератор и через иттерирующую фцию рекурсивную, но оно исполняется всё так же через 1350 милисекунд - то-есть быстрее работать не стало !

//Здесь разница в том что мы не сразу Резолвим Промис, а вызываем его через Конструктор и там внутри каждый раз когда нам нужно зарезолвить этот Промис то мы делаем планирование по времени на сетТаймаут 0 секунд и уже оттуда делаем resolve возвращая Объект
const range = {
  start: 1,
  end: 1000,
  [Symbol.asyncIterator]() {
    let value = this.start;
    return {
      next: () =>
        new Promise(resolve => {
          setTimeout(() => {
            resolve({
              value,
              done: value++ === this.end + 1,
            });
          }, 0);
        }),
    };
  },
};

console.dir({
  range,
  names: Object.getOwnPropertyNames(range),
  symbols: Object.getOwnPropertySymbols(range),
});

let k = 0;

const timer = setInterval(() => {
  console.log('next ', k++);
}, 10);

(async () => {
  const begin = process.hrtime.bigint();
  for await (const number of range) {
    console.log(number);
    if (number === range.end) {
      clearInterval(timer);
    }
  }
  const diff = (process.hrtime.bigint() - begin) / 1000000n;
  console.log('Time(ms):', diff.toString());
})();
