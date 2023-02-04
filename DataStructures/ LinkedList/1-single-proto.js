'use strict';

//это у нас просто абстракция элемента, это будет конструктором Прототипа
function Node(prev, data) {
  this.prev = prev;
  this.data = data;
}

// Usage

//первым аргументом мы передаём ссылку на предыдущий элемент списка, вторым данные которые привязаны к этому конкретно элементу
const n1 = new Node(null, { name: 'first' });
const n2 = new Node(n1, { name: 'second' });
const n3 = new Node(n2, { name: 'third' });

console.dir(n1);
console.dir(n2);
console.dir(n3);

/*
Node { prev: null, data: { name: 'first' } }
Node {
  prev: Node { prev: null, data: { name: 'first' } },
  data: { name: 'second' }
}
Node {
  prev: Node {
    prev: Node { prev: null, data: [Object] },
    data: { name: 'second' }
  },
  data: { name: 'third' }
}

Двухсвязный список это когда есть и prev и next
 */
