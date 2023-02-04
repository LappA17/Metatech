'use strict';

const cancelable = (fn) => {
  const wrapper = (...args) => {
    if (fn) return fn(...args);
  };
  wrapper.cancel = () => (fn = null);
  return wrapper;
};

// Usage

const fn = (par) => {
  console.log('Function called, par:', par);
};

const f = cancelable(fn);

// этот пример не со всем то что нужно потому что у нас в первый таймаут отправляется лямбда, а не сама функция f(как во втором примере). Все таки лучше написать пример на примере readFile
// если я передам f, 10, 'first' то фция second не отменится

setTimeout(() => {
  f('first');
  f.cancel();
}, 10);

// а этот setTimeout - это уже практически вызов с асинхронным контрактом через Коллбеки

setTimeout(f, 20, 'second'); // третий аргумент('second') станет аргументом функции f

/*
Function called, par: first
*/
