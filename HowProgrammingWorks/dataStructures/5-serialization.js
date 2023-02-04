'use strict';

// Здесб мы можжем трансформировать(сериализация) объект или массив в строку

const person = {
  name: 'Marcus',
  city: 'Roma',
  born: 121,
};

const s = JSON.stringify(person); // мы в s получим строчное представление объекта person, то-есть в s будет строка
console.log(s);

const obj = JSON.parse(s); // parse позволит из строки сделать обратно Объект и ссылки уже будут НЕ равны
console.dir(obj);

console.log('person === obj is ', person === obj);

const letters = ['A', 'B', 'C', 'D'];
console.log(letters.toString()); // A,B,C,D можем массив в строку привратить
console.log(JSON.stringify(letters)); // ["A","B","C","D"] каждый элемент массива попал в ковычки. JSON.stringify позволяет абсолютно востановить изначальный массив. К примеру если у нас будет массив ['A', 'B', 'C', 'D']; и мы его учить изменим ['A, B', 'B', 'C', 'D']; то toString() сделает A,B,B,C,D а stringify "A,B","B" и тд
console.log(letters.join('---'));
