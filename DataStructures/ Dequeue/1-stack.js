'use strict';

//Здесь хоть и тоже Stack но предыдущий пример из 6-doubly-proto.js тоже был стеком так как у него были методы push и pop
//У нас здесь Stack сделанный на односвязных списках, нам для Стека двухсвязанность не нужна на самом деле
//Из этого примера нам нужно извлечь что нам что бы сделать Стек не обязательно иметь двухсвязаный список(хватит и одногосвязанного)
//и нам не обязательно иметь два Класса
class Stack {
  constructor() {
    this.last = null;
  }

  push(item) {
    const prev = this.last;
    const element = { prev, item };
    this.last = element;
  }

  pop() {
    const element = this.last;
    if (!element) return null;
    this.last = element.prev;
    return element.item;
  }
}

// Usage

const obj1 = { name: 'first' };
const obj2 = { name: 'second' };
const obj3 = { name: 'third' };

const list = new Stack();
list.push(obj1);
list.push(obj2);
list.push(obj3);

console.dir(list.pop());
console.dir(list.pop());
console.dir(list.pop());
console.dir(list.pop());
