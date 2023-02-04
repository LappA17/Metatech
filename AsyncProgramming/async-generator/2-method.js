'use strict';

class Multiplier {
  constructor(k) {
    this.value = k;
  }

  async *asyncGenMethod(a) {
    yield this.value;
    this.value *= a;
    return this.value;
  }
}

const obj1 = new Multiplier(2);
console.log('obj1 =', obj1);
console.log('obj1.asyncGenMethod(5) =', obj1.asyncGenMethod(5));
console.log('obj1.asyncGenMethod(5).next() =', obj1.asyncGenMethod(5).next());

//obj1.asyncGenMethod(5).next().then(console.log); // { value: 250, done: true } так мы оттуда выймем значение

/*
obj1 = Multiplier { value: 2 }
obj1.asyncGenMethod(5) = Object [AsyncGenerator] {} вот он нам вернул асинхронный генератор
obj1.asyncGenMethod(5).next() = Promise { <pending> } а next вернул Промис
*/
