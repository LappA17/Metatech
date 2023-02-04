'use strict';

const events = require('node:events');

const emitter = () => {
  const ee = new events.EventEmitter();
  //мы сохранили при помощи замыкания в переменную emit метод emit который был у EventEmitter до того,те сохранили ссылку на метод в локал переменую
  const emit = ee.emit;
  //а теперь подменяем этот эмит своим
  ee.emit = (...args) => {
    //вызывает фцию у этого emit которого мы сохранили вот здесь const emit = ee.emit, прикрепляя её к объекту ee(экземпляр к EventEmitter который мы создавали выше и дальше передаём сюда массив аргументов args)
    emit.apply(ee, args);
    //забираем звёздочку из массива аргументов. Она здесь была потому что мы хотели навешивать событие которое будет встречаться на всех именнах событий
    args.unshift('*');
    //еще раз вызываем этот самый emit
    emit.apply(ee, args);
  };
  return ee;
};

module.exports = emitter;
