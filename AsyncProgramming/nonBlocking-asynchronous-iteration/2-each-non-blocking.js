'use strict';

//Здесь уже НЕ блокирующий код
//В этом примере console.log('next ', k++) будет происходить очень часто и всё сильно затормозится, в предыдущих примерах код отрабатывал за 49 мс, а здесь аж 1350 !

const numbers = new Array(1000).fill(1);

//сделаем на вход такую Иттерирующую фцию и к ней на вход массив + ту фцию которую нужно будет вызывать на каждом элементе. Таким образом мы сами реализуем что-то вроде метода forEach у массива, только сделали это в виде фции
const each = (array, fn) => {
  const last = array.length - 1;
  const next = i => {
    //здесь у нас рекурсино вызывается next - те после каждой иттерации случается setTimeout()
    setTimeout(() => {
      fn(array[i], i);
      //здесь происходит Рекурсия, то-есть каждый раз стек очищается перед тем как следующий раз next вызовится
      if (i !== last) next(++i);
    }, 0);
  };

  next(0);
};

let k = 0;

const timer = setInterval(() => {
  console.log('next ', k++);
}, 10);

const begin = process.hrtime.bigint();

each(numbers, (item, i) => {
  console.log(i);
  if (i === 999) {
    clearInterval(timer);
    const diff = (process.hrtime.bigint() - begin) / 1000000n;
    console.log('Time(ms):', diff.toString());
  }
});
