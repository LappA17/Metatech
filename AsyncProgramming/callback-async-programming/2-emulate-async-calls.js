'use strict';

// Run and see random order
// Use global counter to detect finish (bad practice)

//В этом файле наши фции будут выполнятся асинхронно(паралельно), но ответы прийдут в разном порядке, в нашей программе мы нашли одно место где мы можем точно знать когда фция исполнится - это All done! она всегда будет последняя но остальные фции в рандомном порядке исполнятся
//эта фция может на практике понадобится когда нам не важно в каком порядке паралельно исполнятся фции типа readConfig, НО нам нужно выполнить какое-то действие после окончания выполнения всех каких-то фций(типа readConfig)
const callbackCounter = (count, callback) => {
  let counter = 0;
  const done = () => {
    if (++counter === count) callback(); //как только счетчик будет 4 то фция отдаст console.log('All done!'); те мы поймали то место когда в фцию callbackCounter пришло 4 вызова
  };
  return done;
};

// Emulate asynchronous calls

//У нас на вход приходит фция fn которая была с контрактами с коллбеками, но она была асинхронная, мы ее заполнили в замыкание и дальше вернули тоже фцию но которая требует туда какие-то аргумнеты (...args) и дальше будет сетТаймаут на рандомное время от 0 до 1 секунды, то-есть wrapAsync отложен выполнение фции fn на непрогнозированное нами время, нужно помнить что фция fn - это будет наш коллбек который мы будем передавать в wrapAsync
const wrapAsync =
  fn =>
  (...args) =>
    setTimeout(() => fn(...args), Math.floor(Math.random() * 1000));

// Asynchronous functions

//мы обернули все наши тежы readConfig и тд фции в wrapAsync что бы они были похожи на асинхронные фции

//мы когда объявляем фцию readConfig, то вокруг неё сделали вызов другой фции wrapAsync - это очень похоже на Декоратор !
//и эта лямбда которую мы передали в wrapAsync теперь отправилась в неё и хранится там внутри замыкания
const readConfig = wrapAsync((name, callback) => {
  console.log('(1) config loaded');
  //здесь мы водим такую вещь как контракт callback last, error first то-есть у нас callback в этой фции идет последним аргументом, а в результате когда мы в callback что-то возвращаем то ошибка должна идти первым аргументом, в нашем случае null, а данные вторым {name}
  callback(null, { name });
});

const doQuery = wrapAsync((statement, callback) => {
  console.log('(2) SQL query executed: ' + statement);
  callback(null, [{ name: 'Kiev' }, { name: 'Roma' }]);
});

const httpGet = wrapAsync((url, callback) => {
  console.log('(3) Page retrieved: ' + url);
  callback(null, '<html>Some archaic web here</html>');
});

const readFile = wrapAsync((path, callback) => {
  console.log('(4) Readme file loaded');
  callback(null, 'file content');
});

console.log('start');

const callback = callbackCounter(4, () => {
  console.log('All done!');
});

//мы вызываем все эти фции ниже и добавляем callback, все эти фции будут вызваны последовательно, НО результат нам будет приходить ВСЕГДА абсолютно разный !

//фция callback переданы в 4 фции и как только она вызывается 4 раз, счетчик доходит до 4 и мы получаем в консоль All done!
readConfig('myConfig', callback);
doQuery('select * from cities', callback);
httpGet('http://kpi.ua', callback);
readFile('README.md', callback);

console.log('end');

/*
start
end
(3) Page retrieved: http://kpi.ua
(1) config loaded
(2) SQL query executed: select * from cities
(4) Readme file loaded
All done!

start
end
(1) config loaded
(2) SQL query executed: select * from cities
(4) Readme file loaded
(3) Page retrieved: http://kpi.ua
All done!
*/
