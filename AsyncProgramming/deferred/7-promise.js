'use strict';

const { EventEmitter } = require('node:events');

const DEFERRED_PENDING = 0;
const DEFERRED_RESOLVED = 1;
const DEFERRED_REJECTED = 2;

class Deferred extends EventEmitter {
  constructor(onDone = null, onFail = null) {
    super();
    this.value = undefined;
    if (onDone) this.on('done', onDone);
    if (onFail) this.on('fail', onFail);
    this.status = DEFERRED_PENDING;
  }

  isPending() {
    return this.status === DEFERRED_PENDING;
  }

  isResolved() {
    return this.status === DEFERRED_RESOLVED;
  }

  isRejected() {
    return this.status === DEFERRED_REJECTED;
  }

  done(callback) {
    this.on('done', callback);
    if (this.isResolved()) callback(this.value);
    return this;
  }

  fail(callback) {
    this.on('fail', callback);
    if (this.isRejected()) callback(this.value);
    return this;
  }

  resolve(value) {
    this.value = value;
    this.emit('done', value);
    return this;
  }

  reject(value) {
    this.value = value;
    this.emit('fail', value);
    return this;
  }

  // метод Promise нам умеет конвертить Диферр в Промис. Это очень легко сделать так как он написан на базе ЕвентЕмиттера и мы можем внутри метода promise создать new Promise с executor и передать фцию и подписаться на on('done') и на fail

  promise() {
    return new Promise((resolve, reject) => {
      this.on('done', (value) => resolve(value));
      this.on('fail', (error) => reject(error));
    });
  }
}

// Usage

const persons = {
  10: 'Marcus Aurelius',
  11: 'Mao Zedong',
  12: 'Rene Descartes',
};

const getPerson = (id) => {
  const result = new Deferred();
  setTimeout(() => {
    const name = persons[id];
    if (name) result.resolve({ id, name });
    else result.reject(new Error('Person is not found'));
  }, 1000);
  return result;
};

(async () => {
  try {
    const value = await getPerson(10).promise();
    console.log('Resolved p1', value);
  } catch (e) {
    console.log('Rejected p1', e.message);
  }

  try {
    const value = await getPerson(20).promise();
    console.log('Resolved p2', value);
  } catch (e) {
    console.log('Rejected p2', e.message);
  }
})();

// ИТОГ: перейдя к Промисам у нас больше value не торчит и события резолвятся через цепочку .then а Диферры цепочку не создают - что очень плохо так как мы не можем обработать последовательность асинхронных операций, а только одну
