'use strict';

const curry = (fn, ...par) => {
  const curried = (...args) =>
    fn.length > args.length ? curry(fn.bind(null, ...args)) : fn(...args);
  return par.length ? curried(...par) : curried;
};

const fn = () => {
  console.log('Callback from timer');
};

const timeout = (interval, fn) => setTimeout(fn, interval);

const timer = curry(timeout); // мы коррировали сетТаймаут с коллбек ласт
timer(2000)(fn); // и тепреь таймер может принимать эти аргументы по очереди - сначало пришел интервал и уже потом вернулась функция

const timer2s = timer(2000); // порождается таймер который всегда установлен на две секунды
timer2s(fn); // и мы от обычного таймера унаследовали таймер упращенный, который интервал две секунды держит в замыкание

// Таким образом мы понимаем что каррирование нам нужно для того что бы нормально справляться с асинхроностью, передавать аргументы не имея всех аргументов в наличие
