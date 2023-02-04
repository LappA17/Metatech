'use strict';

// Здесь мы уже починим наш Диффер. Мы немного допишем наш done, здесь мы уже сохраняем это в свойство this.onDone = callback; и нам уже будет без разници когда кто-то подписывается на этот Диффер, у него будет оставаться одинаковая консистентная форма и мы коллбек туда сохраняем
// У нас появился resolved, если зарезолвится то станет в true и когда кто-то подписывается на resolved этого Диффера, то мы проверяем если он уже зарезолвился, то мы возьмём это значение и отправим в коллбек callback(this.value)
// if (this.onDone) this.onDone(value); если кто-то подписался на это событие то мы ему это значение и отправляем

const asyncResult = () => ({
  value: undefined,
  onDone: null,
  resolved: false,

  done(callback) {
    this.onDone = callback;
    if (this.resolved) callback(this.value);
    return this;
  },

  resolve(value) {
    this.value = value;
    this.resolved = true;
    if (this.onDone) this.onDone(value);
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
  const result = asyncResult();
  setTimeout(() => {
    result.resolve({ id, name: persons[id] });
  }, 1000);
  return result;
};

// Subscribe
const d1 = getPerson(10);
d1.done((value) => {
  console.log('Resolved d1', value);
});

// Subscribe after resolve
const d2 = getPerson(11);
setTimeout(() => {
  d2.done((value) => {
    console.log('Resolved d2', value);
  });
}, 1500);

/*
Resolved d1 { id: 10, name: 'Marcus Aurelius' }
Resolved d2 { id: 11, name: 'Mao Zedong' }
*/
