'use strict';

// этот пример решает проблему предыдущего 6-примера, потому что здесь у нас уже не блокируется приложение

const iterate = (array, listener) => {
  let counter = 0;
  // setImmediate or setTimeout(0) or process.nextTick
  setInterval(() => {
    listener(array[counter++]); //лисенер вызывается со следующим элементом массива, потому что каунтер будет увеличиваться
    if (counter === array.length) counter = 0;
  }, 1000);
};

const cities = ['Kiev', 'London', 'Beijing'];

const print = (city) => console.log('Next city:', city);

iterate(cities, print);
