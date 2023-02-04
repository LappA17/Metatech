'use strict';

const fs = require('node:fs');

// Так как операция считывания файла - это операция ВВОД/ВЫВОД,
// потом приобразует буфер из utf8 в строку и в лямбду коллбека вернется строка

fs.readFile('./1-callback.js', 'utf8', (err, data) => {
  console.log({ lines: data.split('\n').length });
});

console.log('end'); // енд напичается быстрее чем считывания файла
