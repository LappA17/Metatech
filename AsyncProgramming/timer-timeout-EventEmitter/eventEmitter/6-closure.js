'use strict';

//В предыдущих примерах мы делали EventEmitter на Объекта и Прототипах, а в этом примере уже на Замыкание

//нам безразлично в каком контейнере хранить события, мы можем хранить в замыкание

//точно так же создали фцию emitter
const emitter = () => {
  const events = {}; //точно так же collection
  //возвращаем объект с двумя методами
  //и тут весь тот же код что в Прототипах из первого примера, только не на прототипах, а на замыканиях и мы можем такой emitter создавать без new
  return {
    on: (name, fn) => {
      const event = events[name];
      if (event) event.push(fn);
      else events[name] = [fn];
    },
    emit: (name, ...data) => {
      const event = events[name];
      if (event) event.forEach(fn => fn(...data));
    },
  };
};

// Usage

//слова new здесь нет
const ee = emitter();

ee.on('event1', data => {
  console.dir(data); //{ a: 5 }
});

ee.emit('event1', { a: 5 });
