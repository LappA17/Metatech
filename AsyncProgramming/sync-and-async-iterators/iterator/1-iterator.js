'use strict';

// iterator - это контракт который предпологает что у нас у Объекта который реализовывает этот контракт, есть метод next который возвращает два поля value и done

const iterator = {
  counter: 0,
  next() {
    return {
      value: this.counter++, // current value
      done: this.counter > 3, // boolean
    };
  },
};

const step1 = iterator.next();
const step2 = iterator.next();
const step3 = iterator.next();
const step4 = iterator.next();
console.log({ step1, step2, step3, step4 });

/*
{
  step1: { value: 0, done: false },
  step2: { value: 1, done: false },
  step3: { value: 2, done: false },
  step4: { value: 3, done: true }
}
*/
