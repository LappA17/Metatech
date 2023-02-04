'use strict';

// Здесь будет одна абстрация - Список
// элементы списка представляются здесь в виде объектов, но они создаются Фабрикой
class List {
  constructor() {
    this.last = null;
  }

  // push - это фабрика элементов списка
  push(data) {
    const prev = this.last; //сохранеям в prev элемент который был в laste и чуть ниже присваиваем в ласт новый элемент
    const element = { prev, data }; // создается объект без всякого класса
    this.last = element; // присваиваем элемент в свойство last нашего списка
    return element; // и возвращаем этот элемент
  }
}

// Usage

const obj1 = { name: 'first' };
const obj2 = { name: 'second' };
const obj3 = { name: 'third' };

const list = new List();
list.push(obj1);
list.push(obj2);
list.push(obj3);

console.dir(list.last, { depth: 3 });
