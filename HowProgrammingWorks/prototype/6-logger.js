'use strict';

const logger = (kind) => {
  const color = logger.colors[kind] || logger.colors.info; // если передали аргумент и он свопадает в с полем объекта colors то тот что передали, а если такого цвета нет то инфо
  // возвращаем функцию
  return (s) => {
    const date = new Date().toISOString();
    console.log(color + date + '\t' + s); // \t это символ табуляции
  };
};

// так как функции - это тоже объекты, то мы можем через точку добавить поле colors и присвоить туда литерал объекта

logger.colors = {
  warning: '\x1b[1;33m',
  error: '\x1b[0;31m',
  info: '\x1b[1;37m',
};

// Usage

const warning = logger('warning');
const error = logger('error');
const debug = logger('debug');
const slow = logger('slow');

slow('I am slow logger');
warning('Hello');
error('World');
debug('Bye!');
