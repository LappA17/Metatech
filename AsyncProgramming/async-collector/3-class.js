'use strict';

class Collector {
  constructor(expected) {
    // number or array of string, count or keys
    //если мы передаём в expected массив с ожидаемыми ключами, то он этот массив запихивает в Set
    this.expectKeys = Array.isArray(expected) ? new Set(expected) : null;
    //нам может прийти массив, тогда мы будет от его длины отталкиваться, а если пришел не массив то мы явно понимаем что какое-то число к примеру 3 и уже потом будем сраинвать это с count, то-есть либо по длине массиве либо нам на прямую число прислали
    this.expected = this.expectKeys ? expected.length : expected;
    this.keys = new Set();
    this.count = 0; //кство собранных ключей
    this.timer = null;
    this.doneCallback = () => {};
    this.finished = false;
    this.data = {}; //если ключей мало то проще в Объекте хранить, если много то лучше в Map
  }

  collect(key, err, value) {
    if (this.finished) return this;
    if (err) {
      this.finalize(err, this.data);
      return this;
    }
    if (!this.keys.has(key)) {
      this.count++;
    }
    this.data[key] = value;
    this.keys.add(key);
    if (this.expected === this.count) {
      this.finalize(null, this.data);
    }
    return this;
  }

  //метод pick чуть проще метода collect, нам в pick можно не передавать ошибку, а просто связки ключ-значение collector.pick('key1', 1)
  //а метод collect работает след образом collect('key1', null, 1) то-есть мы на место ошибки передаём null
  pick(key, value) {
    this.collect(key, null, value);
    return this;
  }

  //pick - если мы успешно собарли ключи, а fail - если подкралась ошибка
  fail(key, err) {
    this.collect(key, err);
    return this;
  }

  //take внутри сам делает тот коллбек который мы бы в ручную делали
  take(key, fn, ...args) {
    fn(...args, (err, data) => {
      this.collect(key, err, data);
    });
    return this;
  }

  timeout(msec) {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    if (msec > 0) {
      this.timer = setTimeout(() => {
        const err = new Error('Collector timed out');
        this.finalize(err, this.data);
      }, msec);
    }
    return this;
  }

  //done сохраняет события doneCallback
  done(callback) {
    this.doneCallback = callback;
    return this;
  }

  //внутренний метод
  finalize(err, data) {
    if (this.finished) return this;
    if (this.doneCallback) {
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }
      this.finished = true;
      this.doneCallback(err, data);
    }
    return this;
  }
}

// Здесь мы Класс превратим в Фабрику, нам удобнее что бы фция collect была фцией, а не через new вызывать
const collect = (expected) => new Collector(expected);

// Collect

const collector = collect(3)
  .timeout(1000)
  .done((err, result) => {
    console.dir({ err, result });
  });

const sourceForKey3 = (arg1, arg2, callback) => {
  console.dir({ arg1, arg2 });
  callback(null, 'key3');
};

collector.collect('key1', null, 1);
collector.pick('key2', 2);
collector.take('key3', sourceForKey3, 'arg1', 'arg2');
