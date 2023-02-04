'use strict';

//тоже самое только на Промисах

const sleep = msec =>
  new Promise(resolve => {
    setTimeout(resolve, msec);
  });

(async () => {
  console.log('Start sleep: ' + new Date().toISOString());
  console.log('  Sleep about 3 sec');
  // благодаря тому что мы написали этот код асинхронно то у нас не будет блокироваться ввод/вывод, какие-то нажатия на кнопочки и всё такое
  await sleep(3000);
  console.log('After sleep: ' + new Date().toISOString());
})();
