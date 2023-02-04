'use strict';

// метод cancel отменяет работу промиса или коллбека, но мы здесь отменяем не саму операция а результат возврата от неё. Если мы сделал fs.readFile то мы не можем отменить то что этот файл будет весь прочитан до конца, мы можем только игнорировать результат, представим нам нужно найти в файле какуе-то строчку, мы её нашли прочитав первые 100 мб, а сам файл весит 10гб и вот не смотря на то что мы ее нашли в первые 100мб прочистки кода, то всё равно файл будет читать все 10 гб, но нам просто не будет приходить результат !!! мы не можем сделать так что бы файл перестал читаться где-то на середине !

const cancelable = (fn) => {
  // здесь мы подменяем, у нас была функция fn, а стала фция wrapper
  const wrapper = (...args) => {
    //если фция fn есть то мы её вызываем с этими аргуентами
    if (fn) return fn(...args);
  };
  // примешиваем к этому wrapper метод cancel который отменяет ссылку на функцию, те просто if (fn) не выполнится потому что там будет false
  wrapper.cancel = () => (fn = null);
  return wrapper;
};

// Usage

const fn = (par) => {
  console.log('Function called, par:', par);
};

const f = cancelable(fn);
f('first');
f.cancel();
f('second');

/*
Function called, par: first
*/
