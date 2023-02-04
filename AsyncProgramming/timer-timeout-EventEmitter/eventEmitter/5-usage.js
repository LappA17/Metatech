'use strict';

//const emitter = require('./3-enhanced.js'); если мы будем использовать emitter с 3 примера, то у нас в конце Any event отработает два раза с аргументом 700 те [ '*', { a: 700 } ] и [ '*', { a: 700 }, undefined ]
const emitter = require('./4-star-fix.js');

const ee = emitter();

ee.on('event1', data => {
  console.log('Certain event');
  console.dir(data);
});

ee.on('*', (name, data) => {
  console.log('Any event');
  console.dir([name, data]);
});

ee.emit('event1', { a: 5 });
ee.emit('event2', { a: 500 });
ee.emit('*', { a: 700 });

/*
  Certain event
  { a: 5 }
  Any event
  [ 'event1', { a: 5 } ]
  Any event
  [ 'event2', { a: 500 } ]
  Any event
  [ '*', { a: 700 } ]

  Сначала случился конкретный event - Certain event { a: 5 } это подписка на конкретное имя события

  Дальше случилась подписка на все события Any event с аргументам [ 'event1', { a: 5 } ] и [ 'event2', { a: 500 } ] и  [ '*', { a: 700 } ]
*/
