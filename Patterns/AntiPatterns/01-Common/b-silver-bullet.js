'use strict';

// Antipattern: Silver bullet
// Example: when you know Array methods
// если человек изучил что-то и начинает это везде применять
// представим что человек изучил методы array, мы бы могли циклов прогнать и посчитать сколько символом с пробелом, но человек перегоняет в массив и редьюсит его
{
  const name = 'Marcus Aurelius Antoninus Augustus';
  const spaceCount = name.split(' ').reduce((acc) => acc + 1, 0) - 1; // мы использовали кучу всего и приобразования в памяти произошло кучу всего
  console.log({ spaceCount });
}

// Solution
// здесь мы напишем более долгий код, но за то он лучше читается и БЫСТРЕЕ исполняется !!
{
  const name = 'Marcus Aurelius Antoninus Augustus';
  let spaceCount = 0;
  for (const char of name) {
    if (char === ' ') spaceCount++;
  }
  console.log({ spaceCount });
}

// Antipattern: Silver bullet
// Example: when you know Promises
// человек выучил Промис
{
  const spaceCount = (str) =>
    new Promise((resolve) => {
      let count = 0;
      for (const char of str) {
        if (char === ' ') count++;
      }
      resolve(count);
    });

  const name = 'Marcus Aurelius Antoninus Augustus';
  spaceCount(name).then((count) => console.log({ spaceCount: count }));
}

// Solution
{
  const spaceCount = (str) => {
    let count = 0;
    for (const char of str) {
      if (char === ' ') count++;
    }
    return count;
  };

  const name = 'Marcus Aurelius Antoninus Augustus';
  console.log({ spaceCount: spaceCount(name) });
}
