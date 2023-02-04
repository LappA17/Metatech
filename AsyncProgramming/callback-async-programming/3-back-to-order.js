'use strict';

// Back to order, enclosed callbacks

// Emulate asynchronous calls

//здесь мы хотим что бы фции уже последовательно исполнялись

const wrapAsync =
  fn =>
  (...args) =>
    setTimeout(() => fn(...args), Math.floor(Math.random() * 1000));

// Asynchronous functions

const readConfig = wrapAsync((name, callback) => {
  console.log('(1) config loaded');
  callback(null, { name });
});

const selectFromDb = wrapAsync((query, callback) => {
  console.log('(2) SQL query executed');
  callback(null, [{ name: 'Kiev' }, { name: 'Roma' }]);
});

const getHttpPage = wrapAsync((url, callback) => {
  console.log('(3) Page retrieved');
  callback(null, '<html>Some archaic web here</html>');
});

const readFile = wrapAsync((path, callback) => {
  console.log('(4) Readme file loaded');
  callback(null, 'file content');
});

//мы навешиваем лямбду в качестве коллбека к предыдущей фции такую что бы она вызывала следующую
//Самый главный момент текущего примера что наш код стал НАМНОГО МЕДЛЕНЕЕ ИСПОЛНЯТСЯ !!! Потому что пока одна фци не закончится вторая не начнет своё выполнение !
readConfig('myConfig', () => {
  selectFromDb('select * from cities', () => {
    getHttpPage('http://kpi.ua', () => {
      readFile('README.md', () => {
        console.log('All done!');
      });
    });
  });
});

console.log('END');

/*
(1) config loaded
(2) SQL query executed
(3) Page retrieved
(4) Readme file loaded
All done!
*/
