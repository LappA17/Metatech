'use strict';

//В этом вариант у нас for await тоже разрывается и отдаёт время в Event loop
//здесь код точно так же быстро за 60мс исполняется

const INTERVAL = 10;

//этот Объект будет асинхронно иттерируемым и мы сможем его спред-опператором распаковывать в массив, тот же for await или next будет доступен
const range = {
  start: 1,
  end: 1000,
  [Symbol.asyncIterator]() {
    let time = Date.now();
    let value = this.start;
    return {
      //эту фцию next будет вызывать for await
      next: () => {
        //тут так же проверяем не было ли дохождение до максимального интервала
        const now = Date.now();
        const diff = now - time;
        if (diff > INTERVAL) {
          //если случилось то точно так же обнуляем время
          time = now;
          return new Promise(resolve => {
            setTimeout(() => {
              resolve({
                value,
                done: value++ === this.end + 1,
              });
            }, 0);
          });
        }
        //если в иф не попали то возвращаем промис сразу же со следующим значением
        //здесь точно так же в большинстве случаем код НЕ будет идти в блок if, а только тогда когда время вышло за пределы интервала то мы попадём в if и сбросим счетчик и через setTimeout зарезолвим
        return Promise.resolve({
          value,
          done: value++ === this.end + 1,
        });
      },
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

//всё что здесь написанно - это тоже самое что в блокирующем примере, контракт и синтаксис тот же самый
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
  console.dir({ k });
})();
