'use strict';

const range = {
  start: 1,
  end: 10,
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

console.dir({ range });

(async () => {
  //при помощи await мы можем иттерировать всё что возвращает нам async итерейтор
  for await (const number of range) {
    console.log(number);
  }
  for await (const number of range) {
    console.log(number);
  }
})();

/*
    [Symbol.asyncIterator]() через return возвращает нам объект у которого есть метод next и этот next возвращает Промис и там в resolve помещаем объект из value и done
    и каждый раз когда будет происходить иттерация этого цикла for await (const number of range) - то будет опустошаться у нас стек, будет проходит полный цикл, потому что мы внутри делаем setTimeot и следующая иттерация цикла будет начинаться с пустого стека и у нас иттераирование по range будет асинхронным

    {
    range: {
        start: 1,
        end: 10,
        [Symbol(Symbol.asyncIterator)]: [Function: [Symbol.asyncIterator]]
    }
    }
    1
    2
    3
    4
    5
    6
    7
    8
    9
    10
    1
    2
    3
    4
    5
    6
    7
    8
    9
    10
    То-есть у нас не наложились 11 22 33 и тд, а из-за await все произошло последовательно
*/
