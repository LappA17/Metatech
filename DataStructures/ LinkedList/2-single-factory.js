'use strict';

//замыкание потому что фция возвращает сразу Объект
//те это фция фабрика которая пладит объекты одинаковой формы
const node = (prev, data) => ({ prev, data });

// Usage

const n1 = node(null, { name: 'first' });
const n2 = node(n1, { name: 'second' });
const n3 = node(n2, { name: 'third' });

console.dir(n1);
console.dir(n2);
console.dir(n3);

/* Здесь мы будем строить односвязный список на замыканиях 

{ prev: null, data: { name: 'first' } }
{
  prev: { prev: null, data: { name: 'first' } },
  data: { name: 'second' }
}
{
  prev: { prev: { prev: null, data: [Object] }, data: { name: 'second' } },
  data: { name: 'third' }
}

*/
