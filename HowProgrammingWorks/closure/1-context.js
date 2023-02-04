'use strict';

// Внутри функции мы можем что-то хранить
// мы создаём объект или хеш-таблицу

const hash = () => {
  const data = {};
  let counter = 0;
  // когда вызывается лямбда ниже то у нас по ключу в data определенный value
  return (key, value) => {
    data[key] = value;
    counter++;
    console.dir({ counter });
    return data; // из функции сам объект и возвращается
  };
};

// Usage

const h1 = hash(); // здесь мы экспортируем из функции ссылку на другую функцию
h1('name', 'Marcus'); // и когда мы ее вызываем то она все равно внутри работает внутри замыкание фции hash
h1('city', 'Roma'); // в data будет создана два ключи name и city с соотвествующими значениями
const obj1 = h1('born', 121); // еще раз вызываем и еще передаем ключ-значение и помещаем ссылку на фцию в obj1. И этот obj1 - будет ссылкой на Объект data
console.dir({ obj1 });

/*
{ counter: 1 }
{ counter: 2 }
{ counter: 3 }
{ obj1: { name: 'Marcus', city: 'Roma', born: 121 } }
*/
