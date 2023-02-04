'use strict';

// сделаем такую же штуку на thenable что бы мы могли писать .then(onSuccess, onError) .then(onSuccess, onError) .then(onSuccess, onError) и тд

const getNumbers = () => ({
  numbers: [1, 2, 3],
  then(onFulfilled, onRejected) {
    const num = this.numbers.shift(); // очень важно ! если мы ссылаемся на конкретнео поле объекта типа numbers то только через this
    if (num) {
      onFulfilled(num);
    } else {
      onRejected(new Error('I have no numbers for you'));
    }
    return this; // chain thenable , те в конце выполнения метода then() она возвращает ссылку на этот же объект. И этот this будет ссылаться на объект в getNumbers
  },
});

// Usage

const onSuccess = (res) => console.dir({ res });
const onError = (err) => console.dir({ err: err.message });

// в этом и отличие от Промисов. У Промисов каждый раз после then генерируется новый объект, а тут всего лишь один. Благодаря этому мы экономим на конструкции памяти

getNumbers()
  .then(onSuccess, onError)
  .then(onSuccess, onError)
  .then(onSuccess, onError)
  .then(onSuccess, onError)
  .then(onSuccess, onError);

/*
{ res: 1 }
{ res: 2 }
{ res: 3 }
{ err: 'I have no numbers for you' }
{ err: 'I have no numbers for you' }
*/
