'use strict';

// Back to order
// Use global data and decentralized control flow (bad practices)

//Здесь уже будет пример без ёлочки вложенностей как в предыдущем 3 файле, но файл так же долго будет исполнятся как и в предыдущем примере !

const data = {};

// Emulate asynchronous calls

const wrapAsync =
  fn =>
  (...args) =>
    setTimeout(() => fn(...args), Math.floor(Math.random() * 1000));

// Asynchronous functions

//теперь у нас readFile знает о том что после того как он выполнится ему нужно выполнит selectFromDb(); а selectFromDb знает что нужно выполнить в свою очередь getHttpPage и тд
//важно понимать что в этом примере уже нет такого места который бы упровлял последовательностью исполнения, то-есть последовательность исполнения размазанно по всей программе, в каждой функции. Это минус потому что хоть и елочка коллбеков пропала но теперь что бы если в будущем нам нужно будет вставить где-то следующий новый шаг то нам нужно в коде рыться что бы где-то там после вызова какой-то фции его вставить

const readFile = wrapAsync(() => {
  console.log('(4) Readme file loaded');
  data.readme = 'file content';
  console.dir(data);
  console.log('All done!');
});

const getHttpPage = wrapAsync(() => {
  console.log('(3) Page retrieved');
  data.html = '<html>Some archaic web here</html>';
  readFile();
});

const selectFromDb = wrapAsync(() => {
  console.log('(2) SQL query executed');
  data.cities = [{ name: 'Kiev' }, { name: 'Roma' }];
  getHttpPage();
});

const readConfig = wrapAsync(() => {
  console.log('(1) config loaded');
  data.config = { name: 'name' };
  selectFromDb();
});

// Start execution

readConfig();
