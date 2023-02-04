'use strict';

const tag = (strings, ...values) => {
  // В массив values попадут все вычесленные из переменных значение такие как greeting
  console.dir({ strings, values });
};

// Usage

const greeting = 'Hello';
const person = { name: 'Marcus Aurelius' };

const text = tag`${greeting} ${person.name}!`; // перед строкой мы вызвали функцию - это шаблонизирующая фция !!
console.dir({ text });

/*
{ strings: [ '', ' ', '!' ], values: [ 'Hello', 'Marcus Aurelius' ] }
{ text: undefined }

Откуда в массиве string взялись пустая строка, пробел и !
Потому что до первого вырожение идет пустая строка, вот здесь сразу после начало бектиков - tag`${greeting} если бы мы написали так tag` ${greeting} то попал бы пробел
Дальше один пробел - это пробел разделяюзий ${greeting} ${person.name}
и восклицательный знак в конце
*/
