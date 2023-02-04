'use strict';

const data = [
  ['Marcus Aurelius', '121-04-26', 'Rome'],
  ['Commodus Antoninus', '161-08-31', 'Rome'],
  ['Victor Glushkov', '1923-08-24', 'Rostov on Don'],
  ['Ibn Arabi', '1165-11-16', 'Murcia'],
  ['Mao Zedong', '1893-12-26', 'Shaoshan'],
  ['Rene Descartes', '1596-03-31', 'La Haye en Touraine'],
];

class Person {
  get name() {
    return this[0];
  }

  get birth() {
    return this[1];
  }

  get city() {
    return this[2];
  }

  get age() {
    const difference = new Date() - new Date(this.birth);
    return Math.floor(difference / 31536000000);
  }

  toString() {
    return this.name + ' age is ' + this.age;
  }
}

// Пишем запросс, и этот зарпосс будет равен трём условиям ниже
const query = (person) => person.name !== '' && person.age > 18 && person.city === 'Rome';

console.dir(data);

data.forEach((person) => {
  Object.setPrototypeOf(person, Person.prototype); // мы каждой Персоне присваиваем Person.prototype. И оно присвоется даже не смотрят на то что там каждый элемент массива data - это тоже массив, а не объект, но оно всё равно унаследует !
  // person.__proto__ = Person.prototype
});

// отфильтровуем по нашему запросу и самое главное что теперь мы можем фильтровать потому что мы привязали каждый элемент массива к нашему классу, теперь у него есть геттеры и сеттеры и person.name будет через геттер братться и age и city, иначе мы бы в query писали person[0] !== '' && person[1] > 18 && persone[2] === 'Rome' !!
const res = data.filter(query);
console.log(res.join('\n'));
