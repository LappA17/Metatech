'use strict';

// Antipattern: Magic number
// проблема в том что мы не понимаем что это за 17
{
  const name = 'Marcus Aurelius';
  const result = name.padStart(17);
  console.log(result);
}

// Solution
// правильно вынести это 17 в отдельную перменную что бы потом понимать что это такое
{
  const NAME_LENGTH = 17;
  const name = 'Marcus Aurelius';
  const result = name.padStart(NAME_LENGTH); // добавляет 17 пробелов перед именнем
  console.log(result);
}

// Solution
{
  const PAD_LENGTH = 2;
  const name = 'Marcus Aurelius';
  const result = name.padStart(name.length + PAD_LENGTH); // отступить на длину имени плюс два отступа
  console.log(result);
}

// Solution
{
  const config = require('./config.js');
  const name = 'Marcus Aurelius';
  const result = name.padStart(config.name.length);
  console.log(result);
}

// Antipattern: : Magic string
// 2 строчка 10 колоночки, на эту строчку у нас переместится курсор
{
  const pos = '\x1b[2;10H';
  console.log(pos);
}

// Solution
{
  const pos = (row, col) => console.log(`\x1b[${row};${col}H`);
  pos(2, 10); // эти 2 и 10 по хорошему тоже вынести в переменные
}

// Exception
{
  const name = 'Marcus Aurelius';
  for (let i = 0; i < name.length; i++) {
    console.log(i, name[i]);
  }
}

// Exception
{
  const last = (array) => array[array.length - 1]; // фция которая берёт последний элемент из массива
  const array = ['A', 'B', 'C'];
  console.log(last(array));
}
