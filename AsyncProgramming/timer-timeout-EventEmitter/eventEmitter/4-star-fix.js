'use strict';

const events = require('node:events');

//здесь мы делаем еще одну доп проверку, потому что мы не должны два раза вызывать apply. Оно оба раза случатся на * потому что если кто-то подпишется на событие с именем * то нам нужно это предусмотреть
const emitter = () => {
  const ee = new events.EventEmitter();
  const emit = ee.emit;
  ee.emit = (...args) => {
    //если первым аргумент не звёздочка, то такой подпищек отработает
    if (args[0] !== '*') emit.apply(ee, args);
    //заберём оттуда звездочку
    args.unshift('*');
    //потому еще раз отработаем
    emit.apply(ee, args);
  };
  return ee;
};

module.exports = emitter;
