'use strict';

//Важно понимать что если у нас есть фция которая результатом возвращает коллбек - то она не обязательно асинхрона

// Sequential calls and sequentian execution
// of 4 pseudo-asynchronous functions

//представим что у нас есть 4 асихнроных фций которые нам нужно исполнить именно последовательно, то-есть у нас есть метод для прочтения какого-то конфига, запрос в бд, сделаем гет по какому-то апи к внешнему сервису и в конце прочитаем файл и объеденим это всё вместе

const readConfig = (name, callback) => {
  setTimeout(() => {
    console.log('(1) config loaded: ' + name);
    callback(null, { name });
  }, 1000);
};

const doQuery = (statement, callback) => {
  setTimeout(() => {
    console.log('(2) SQL query executed: ' + statement);
    callback(null, [{ name: 'Kiev' }, { name: 'Roma' }]);
  }, 1000);
};

const httpGet = (url, callback) => {
  setTimeout(() => {
    console.log('(3) Page retrieved: ' + url);
    callback(null, '<html>Some archaic web here</html>');
  }, 1000);
};

const readFile = (path, callback) => {
  setTimeout(() => {
    console.log('(4) Readme file loaded');
    callback(null, 'file content');
  }, 1000);
};

console.log('start');

readConfig('myConfig', () => {});
doQuery('select * from cities', () => {});
httpGet('http://kpi.ua', () => {});
readFile('README.md', () => {});

console.log('end');
