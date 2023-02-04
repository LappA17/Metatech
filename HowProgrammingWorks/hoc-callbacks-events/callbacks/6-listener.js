'use strict';

// у нас есть еще подтип коллбеков - это наши listener(обработчики событий)
// разница между коллбеком и listener что коллбек вызывается один раз, а листенер много раз

const iterate = (array, listener) => {
  for (const item of array) {
    listener(item);
  }
};

const cities = ['Kiev', 'London', 'Beijing'];

const print = (city) => {
  console.log('City:', city);
};

iterate(cities, print); // фция iterate - это хок, который принимает массив и фцию который умеет распечатывать элемент массива, эта фций iterate - аналог forEach

// в этом примере исполнение программы будет полностью заблокированно потому что код синхронный
