'use strict';

// В двух предыдущих примерах мы делали iterator и iterable как литерал Объекта(те просто const iterable = {})
// делать itetable в виде объетка не очень удобно и нам бы хотелось иметь класс от корого мы в будущем сможем к примеру отнаследоваться, обернуть, добавить другие методы и тд

class Counter {
  constructor(begin, end, step = 1) {
    this.begin = begin;
    this.end = end;
    this.step = step;
  }
  [Symbol.iterator]() {
    const end = this.end; // мы сохраним текущие значение this.end в переменную end потому что во время иттерарирование кто-то его там сможет еще поменять
    let i = this.begin; // тоже самое с begin - на всякий случай мы сохраним
    const step = this.step;
    const iterator = {
      next() {
        const item = {
          value: i,
          done: i > end,
        };
        i += step;
        return item;
      },
    };
    return iterator;
  }
}

// Usage

const iterable = new Counter(0, 3);

const iterator = iterable[Symbol.iterator](); // так как объект iterable - итерируемый, то мы можем вызвать у него [Symbol.iterator]() в виде функции
const step1 = iterator.next();
const step2 = iterator.next();
const step3 = iterator.next();
const step4 = iterator.next();
console.log({ step1, step2, step3, step4 });

for (const step of iterable) {
  console.log({ step });
}

console.log({ steps: [...iterable] });
