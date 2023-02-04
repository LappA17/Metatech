'use strict';

// здесь мы воспользуемся что мы к шаблонизирующим фция можем добавлять строки как в примере 8

const esc = (code, s) => `\x1b[${code}m${s}\x1b[0m`; // ескейп последовательность для терминала, которая умеет переключать выввод в италик, андерлайн, болд и тому подобные стили. Аргумент code - это код операции(для подчеркнутых, наклонных, для инверсии, для болда и тд), а аргумент s - это строчка

const tag = (strings, ...values) => {
  const result = [strings[0]]; // первый элемент из strings
  let i = 1;
  for (const val of values) {
    // Забераем каждое следующие значение из тех трех переменных(сначало greeting потом position потом name прийдут)
    const str = strings[i++];
    result.push(esc(i + 1, val), str); // val - это значение переменной из массива values, а str это у нас строки из массива strings которые у нас разделаю те переменные из values
  }
  return result.join('');
};

// Usage

const greeting = 'Ave';
const person = { name: 'Marcus Aurelius', position: 'Emperor' };

const text = tag`${greeting} ${person.position} ${person.name}!`; // все три эти переменные прийдут в массив values
console.log(text);
