'use strict';

const fs = require('node:fs').promises;

// Antipattern: Hard code
(async () => {
  // имя файла ./2-hard-code.js захардкоженно
  // то что ютф 8 захардкоженно то скорее всего это нормально потому что наша программа скорее всего только с ютф8 и будет работать
  const data = await fs.readFile('./2-hard-code.js', 'utf8');
  const lines = data.split('\n'); // слеш n тоже захардкожен
  const str = lines[6]; // хардкод 6 строчки, не известно зачем, лучше вынести в константу
  const fileName = str.substring(34, 50); // magic number и тоже хардкод
  console.dir({ fileName });
})();

// Solution
// здесь все уже вынесенно в константы и аргументами фции
(async () => {
  const LINE_SEPARATOR = '\n';
  const FILE_ENCODING = 'utf8';

  const readFileBlock = async (name, line, start, end) => {
    const data = await fs.readFile(name, FILE_ENCODING);
    const lines = data.split(LINE_SEPARATOR);
    const str = lines[line];
    return str.substring(start, end);
  };

  const block = await readFileBlock('./2-hard-code.js', 6, 34, 50);
  console.dir({ block });
})();
