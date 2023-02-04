'use strict';

// Здесь fn - это фция высшего порядка + она еще и коллбек

const fn = (par, callback) => {
  if (!par) {
    callback(new Error('Parameter needed'));
    return;
  }
  callback(null, `Data ${par}`);
  return 'Value';
};

// кусочек кода ниже исполнит фцию высшего порядка(хок)
// то что попадёт в переменную res - посчитается синхронно ! Нет ничего асинхронного и ничто не прерывает исполнение кода

const res = fn('example', (err, data) => {
  if (err) throw err;
  console.dir({ data });
});

console.dir({ res });

/*
  { data: 'Data example' }
  { res: 'Value' }
  Всё последовательно выполнилось
*/
