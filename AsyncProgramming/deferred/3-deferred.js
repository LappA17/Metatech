'use strict';

// Теперь у нашего deferred будет три разных статуса: пендинг, резолвд, реджектед
// То-есть как мы видим из Диферра уже развились Промисы, Промисы - это усовершенственные Диферы, огромный минус Диферров что все его свойства торчат откуда угодно и их можно менять, так же подписывания на событие только один onDone или один onFail. Нам нужно понять откуда взялись и почему Промисы
// У нас нет Promise.status, нам что бы узнать зарезолвился ли Промис - нужно на него подписаться и через then уже понять, так же мы не можем посмотреть подписчиков Промиса, а здесь есть onDone, onFail

const DEFERRED_PENDING = 0;
const DEFERRED_RESOLVED = 1;
const DEFERRED_REJECTED = 2;

const deferred = () => ({
  value: undefined,
  onDone: null,
  onFail: null,
  status: DEFERRED_PENDING,

  isPending() {
    return this.status === DEFERRED_PENDING;
  },

  isResolved() {
    return this.status === DEFERRED_RESOLVED;
  },

  isRejected() {
    return this.status === DEFERRED_REJECTED;
  },

  done(callback) {
    this.onDone = callback;
    if (this.isResolved()) callback(this.value);
    return this;
  },

  // метод fail такой же самый как done , только у нас проверяется isRejected

  fail(callback) {
    this.onFail = callback;
    if (this.isRejected()) callback(this.value);
    return this;
  },

  resolve(value) {
    this.value = value;
    this.status = DEFERRED_RESOLVED;
    if (this.onDone) this.onDone(value);
    return this;
  },

  // reject такой же как и resolve только вызываются разные коллбеки, onDone и onFail

  reject(value) {
    this.value = value;
    this.status = DEFERRED_REJECTED;
    if (this.onFail) this.onFail(value);
    return this;
  },
});

// Usage

const persons = {
  10: 'Marcus Aurelius',
  11: 'Mao Zedong',
  12: 'Rene Descartes',
};

const getPerson = (id) => {
  const result = deferred();
  setTimeout(() => {
    const name = persons[id];
    // если имя в объекте не нашли то реджектим ошибку
    if (name) result.resolve({ id, name });
    else result.reject(new Error('Person is not found'));
  }, 1000);
  return result;
};

const d1 = getPerson(10)
  .done((value) => console.log('Resolved d1', value))
  .fail((error) => console.log('Rejected d1', error));
console.dir({ d1 });

const d2 = getPerson(20)
  .done((value) => console.log('Resolved d2', value))
  .fail((error) => console.log('Rejected d2', error.message));
console.dir({ d2 });

/*
{
  d1: {
    value: undefined,
    onDone: [Function (anonymous)],
    onFail: [Function (anonymous)],
    status: 0,
    isPending: [Function: isPending],
    isResolved: [Function: isResolved],
    isRejected: [Function: isRejected],
    done: [Function: done],
    fail: [Function: fail],
    resolve: [Function: resolve],
    reject: [Function: reject]
  }
}
{
  d2: {
    value: undefined,
    onDone: [Function (anonymous)],
    onFail: [Function (anonymous)],
    status: 0,
    isPending: [Function: isPending],
    isResolved: [Function: isResolved],
    isRejected: [Function: isRejected],
    done: [Function: done],
    fail: [Function: fail],
    resolve: [Function: resolve],
    reject: [Function: reject]
  }
}
Resolved d1 { id: 10, name: 'Marcus Aurelius' }
Rejected d2 Person is not found
*/
