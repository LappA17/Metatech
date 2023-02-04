'use strict';

const Context = function () {
  this.name = 'Marcus';
  const city = {
    name: 'Kiev',
    year: 482,
    f1: function () {
      return this.name; // сможет обратиться к name
    },
    f2: () => {
      return this.name; // не сможет, потому что это лямбда
    },
    f3() {
      return this.name; // тоже сможет, хоть и без ключевого слова function, но метод объекта имеет контекст вызова
    },
  };
  return city;
};

const city = new Context(); // создаем новый экхемпляр

console.log('city.f1() = ' + city.f1());
console.log('city.f2() = ' + city.f2());
console.log('city.f3() = ' + city.f3());

// Если мы вызываем функцию без аргументов - то эта функция с побочными эффектами !
