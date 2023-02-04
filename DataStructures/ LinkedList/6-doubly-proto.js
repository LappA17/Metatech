'use strict';

//здесь уже по сути написан двухсвязный список, который работает в качестве Стека

//мы будем хранить последний и первый элемент
function LinkedList() {
  this.first = null;
  this.last = null;
  this.length = 0;
}

LinkedList.prototype.push = function (data) {
  const node = new Node(this, data); //создаем новый экземпляр Ноды
  node.prev = this.last; //мы на этому элементу в свойство prev записываем ссылку на элемент который был последний
  if (this.length === 0) this.first = node;
  //если ниодного элемента не было то у списка есть ссылка на первый элемент и этой Ноде ее писвоили, такое исполняется на пуш первого элемента в список
  else this.last.next = node; //элемент который был последний в next ставим текущий элемент
  this.last = node; //самому списку говорим что последний добавленный элемент - это ссылка на нашу Ноду
  this.length++; //кство элементов добавили
  return node; //сам элемент вернули
};

//pop уже будет возвращать данные о последнем элемент а сам элемент(его ссылка) вообще теряется, она нам больше не нужна
//по приниципу последнего положили - первого забрали, то-есть это работает как Стек
LinkedList.prototype.pop = function () {
  if (this.length === 0) return null; //если данных нет - мы сразу вышли
  const node = this.last; //наше поле last уже чему-то было равно и мы это дело присвоили в node и мы в самом низу вернем с этой node данные
  //нам нужно пропатчить предыдущий элемент + поменять сам список, что бы они не знали какой элемент мы удаляем
  this.last = node.prev; //last-это ссылка на последний элемент в списке, а нам нужно на предпоследний-node.prev
  if (this.last) this.last.next = null;
  //у того элемента который мы открепляем у него есть ссылка на list,prev,next и мы все эти ссылки очищаем потому что может оказаться что кто-то где-то запомнил ссылку на последний элемент из списка и он не удалится и у него будут не пустые здесь элементы и он будет ссылаться на список, а список будет думать что он удалён, по-этому мы их чистим
  node.list = null;
  node.prev = null;
  node.next = null;
  this.length--; //уменьшаем кство элементов
  return node.data;
};

//Конструктор Ноды принимает список и данные которые к этому элементы нужно прицепить
function Node(list, data) {
  this.list = list; //каждый элемент имеет ссылку на тот список в котором он лежит
  this.data = data; //на данные которые к нему прицеплины
  this.prev = null;
  this.next = null;
}

// Usage

const list = new LinkedList();
list.push({ name: 'first' });
list.push({ name: 'second' });
list.push({ name: 'third' });

console.dir(list.pop());
console.dir(list.pop());
console.dir(list.pop());
console.dir(list.pop());

list.push({ name: 'uno' });
list.push({ name: 'due' });
console.dir(list.pop());
list.push({ name: 'tre' });
console.dir(list.pop());
console.dir(list.pop());
