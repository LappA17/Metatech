'use strict';

// Antipattern: Premature optimization is the root of all evil D. Knuth
// Antipattern: Micro-optimization
// Преждевременная и микро оптимизация
// Оптимизировать нужно только тогда, когда этот участок кода вызывается много раз где ! А если условный range работает на 100мс медленей чем range 3, то в этом проблемы нет если этот код там 2 раза в день вызывается
{
  // фция range вернёт нам массив от одного до какого-то значения и нам показалось что просто создать массив и в него циклом пушить - будет долго работать, потому что размер массива будет постоянно меняться
  const range = (from, to) => {
    const arr = [];
    for (let i = from; i <= to; i++) arr.push(i);
    return arr;
  };
  // Этот пример из range2 с такой небольшой оптимизацией - это еще нормальная оптимизация, а остальное уже оверкилл !
  //и мы начинаем оптимизировать уже в range2
  const range2 = (from, to) => {
    if (to < from) return []; // как минимум какие-то кейсы сразу отбросим
    const len = to - from + 1;
    const range = new Array(len); // сразу создадим массив определенной длины и туда будем добавлять по индексу, это немножко ускорит потому что не будет перераспределение памяти. Так как мы в len высчитали сразу длину массива то мы сразу же создали массив через оператор new и он у нас заполнен empty elements
    for (let i = from; i <= to; i++) {
      range[i - from] = i; //мы в каждый элемент пишем циферку
    }
    return range;
  };
  // еще по оптимизируем
  const range3 = (from, to) => {
    if (to < from) return [];
    const len = to - from + 1;
    const range = new Array(len);
    let index = 0;
    for (let i = from; i <= to; i++) {
      // у нас в предыдущим примере вот так вот по глупому выделяется индекс i - from
      // и мы предположим что инкремент index++ работает быстрее чем вычитание i - from. На асемблере именно так :)
      range[index] = i;
      index++;
    }
    return range;
  };
  //дальше оптимизируем :)
  const range4 = (from, to) => {
    if (to < from) return [];
    const range = [0]; // сразу создадим массив в который положим number, потому что нам кажется что js догадается что массив будет из намберов и компилятор соптимизирует
    range.length = to - from + 1; // чуточку расширил положив след элемент, что бы опять v8 лучше соптимизировал
    let index = 0;
    for (let i = from; i <= to; i++) {
      range[index] = i;
      index++;
    }
    return range;
  };

  const range5 = (from, to) => {
    if (to < from) return [];
    const len = to - from + 1;
    const range = new Array(len).fill(0); // может быть js догадается если мы сразу же сделаем массив из n элементом те нужной мне длины и так как они все empty element - нам нужно их заполнить .fill(0) и так как там везде 0, то js должен догадаться что там все числа используются и оптимизировать будет лучше
    let index = 0;
    for (let i = from; i <= to; i++) {
      range[index] = i;
      index++;
    }
    return range;
  };

  // Micro-benchmarking utilities

  const rpad = (s, char, count) => s + char.repeat(count - s.length);
  const lpad = (s, char, count) => char.repeat(count - s.length) + s;
  const relativePercent = (best, time) => (time * 100n) / best - 100n;

  const benchmark = (count, args, tests) => {
    const times = tests.map((fn) => {
      const result = [];
      const begin = process.hrtime.bigint(); // hrtime - это таймер высокого разришения
      for (let i = 0; i < count; i++) result.push(fn(...args));
      const end = process.hrtime.bigint();
      const diff = end - begin;
      const name = rpad(fn.name, '.', 22);
      const iterations = result.length;
      const log = [name, diff];
      console.log(log.join(' '));
      return { name, time: diff };
    });
    console.log();
    const top = times.sort((t1, t2) => Number(t1.time - t2.time));
    const best = top[0].time;
    top.forEach((test) => {
      test.percent = relativePercent(best, test.time);
      const time = lpad(test.time.toString(), '.', 10);
      const percent = test.percent === 0 ? 'min' : test.percent + '%';
      const line = lpad(percent, '.', 10);
      console.log(test.name + time + line);
    });
  };

  // Micro-benchmarking

  benchmark(1000000, [1, 100], [range, range2, range3, range4, range5]);
}

/*
range................. 877877708
range2................ 488841833
range3................ 273551209
range4................ 884596416
range5................ 316516167

range3.................273551209........0%
range5.................316516167.......15%
range2.................488841833.......78%
range..................877877708......220%
range4.................884596416......223%

[Done] exited with code=0 in 3.045 seconds
*/
