'use strict';

//Очерель(Queue) работает немного по другому, если Стеки мы только с одной стороны только добавляли(с конца добавляли и с конца забирали)
//а в Очереди мы с конца добавляем а с начала забираем - то-есть элементы стоят в очереди, последний зашел последний и вышел, а в Стеки последний зашел, но первый вышел

class Queue {
  constructor() {
    //здесь мы уже в конструкторе делаем Двухсвязанный список
    this.first = null;
    this.last = null;
  }
  //добавляет в конец
  put(item) {
    const last = this.last; //берем последний добавленный
    const element = { next: null, item }; //создаем новый элемент
    if (last) {
      //если последний добавленный был, то мы его патчим
      last.next = element; //добавляем ссылку на наш новый уже элемент
      this.last = element; //самой Очереди добавляем ссылку на наш новый элемент
    } else {
      //а если в этой очереди никогда не было ниодного элемента
      //то мы первому и последнему сразу объявлем текущий элемент
      this.first = element;
      this.last = element;
    }
  }
  //забирает с начала
  pick() {
    const element = this.first; //pick с головоый забирает this.first
    if (!element) return null;
    //если last равен first(потмоу что в element запихнули выше first) - это значит что у нас в списке был всего один элемент
    if (this.last === element) {
      //то это значит что и first и last нужно очистить
      this.first = null;
      this.last = null;
    } else {
      //а если было больше чем один элемент то мы пропатчим first
      this.first = element.next; //от того элемента который мы забираем берём следующий от него и помещаем на первое
    }
    return element.item; //item - это наши данные, то же самое что data
  }
}

// Usage

const obj1 = { name: 'first' };
const obj2 = { name: 'second' };
const obj3 = { name: 'third' };

const queue = new Queue();
queue.put(obj1);
queue.put(obj2);
queue.put(obj3);

console.dir(queue.pick());
console.dir(queue.pick());
console.dir(queue.pick());
console.dir(queue.pick());
