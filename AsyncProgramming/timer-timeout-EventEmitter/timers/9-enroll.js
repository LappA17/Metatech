'use strict';

const timers = require('node:timers');

//мы создаем сами объект таймера - это примерно такой же объект как у нас setTimeout возвращает
const timer = {
  _onTimeout: () => {
    console.log('_onTimeout called');
  },
};

//мы сначало навешиваем таймаут на наш ручной timer который мы с эмулировали из объекта
timers.enroll(timer, 1000);
//потом мы его активируем
timers.active(timer);
console.dir({ timer });
