'use strict';

//абстракция list из которой возвращается объект
//push будет добавлять в список
//last для получения последнего элемента
//Symbol.iterator - для того что бы можно было for проходится
const list = () => {
  let element;
  return {
    push(data) {
      //push принимает объект data
      element = {
        //создаем новый объекьт element с двумя ссылками prev и data
        prev: element,
        data,
      };
      return element; // возвращаем, то-есть после вызова метода push нам вовзращается ссылка на элемент списка, то-есть не тот объект который был в список добавлен и не сам список, а именно ссылка на элемент списка, на ноду(елемент)
    },

    last: () => element, //если мы вызываем last до первого пуша то element у нас undefined, но если мы сделали пуш то уже вернем сам element потому что мы в push его там присваиваем

    //[Symbol.iterator] - это уже фция которая возвращает объект
    [Symbol.iterator]: () => ({
      current: element, // поле current ссылаться будет на элемент(а элемент - это последний добавленый элемент)
      next() {
        const element = this.current; // это current что выше
        if (!element)
          //как только вызвали next то взяли из текущего элемента current и если current нет то мы закончили
          return {
            done: true,
            value: null,
          };
        this.current = element.prev; //переместили иттератор на следующие позицию и ниже вернём текущее значение
        return {
          // из метода next мы возвращаем два поле done(закончили ли мы операцию) и value
          done: false,
          value: element.data,
        };
        // таким образом каждый раз когда мы делаем for of у нас при каждой иттерации вызывается next, иттератор перемищается на следующую позицию и возвращает нам следующий элемнет из этого двухсвязанного списка
      },
    }),
  };
};

// Usage

const obj1 = { name: 'first' };
const obj2 = { name: 'second' };
const obj3 = { name: 'third' };

const l1 = list();
l1.push(obj1);
l1.push(obj2);
l1.push(obj3);

console.dir(l1.last()); //выводим последний

console.dir([...l1]); //так как список теперь иттерируемый - мы можем его разварачивать при помощи спред опператора и записывать в array

//А теперь уважно ! Хоть и l1 не array, но мы можем по нему пройтись for of благодаря Symbol.iterator
for (const element of l1) {
  console.log(element);
}

/*
    Здесь мы уже сделаем абстракцию, которая отвечает за сам список, т.е. теперь у нас есть абстракция отвечающий за элемент списка и абстракция отвечающий за сам список(она будет называться list), Элемент будет называться нодой

{
  prev: {
    prev: { prev: undefined, data: [Object] },
    data: { name: 'second' }
  },
  data: { name: 'third' }
}
[ { name: 'third' }, { name: 'second' }, { name: 'first' } ]
{ name: 'third' }
{ name: 'second' }
{ name: 'first' }


*/
