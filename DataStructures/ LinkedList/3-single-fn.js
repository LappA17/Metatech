'use strict';

//Тут мы строим на замыканиях
//нам приходят какие-то данные -> она нам возврвщает еще одну фцию element -> мы в эту фцию element будем класть следующие данные -> сама фция
//уже рекурсивно вызывает фцию node и эти данные отправляются в data в const node = data, то-есть ога пораждает еще одно замыкание ->
//потом из фции node нам вернется фция element и мы ее присвоили в next(во внутренний контекст) ->
//в эту фцию мы записали еще prev и туда передали ссылку на элемент -> return next и вернули саму фцию
//то-есть у нас абсолютно всё функционального типа(кроме .prev - потому что это уже свойство фции)
const node = data => {
  const element = data => {
    const next = node(data);
    next.prev = element;
    return next;
  };
  element.data = data;
  return element;
};

/*  Это тот же самый код что выше только на другом синтаксисе
Мы получаем data и element -> сразу возвращаем element который является фцией и к этой фции мы добавили новое свойство prev и data через Obj.assign
const node = (data, element) => (element = Object.assign(
  data => Object.assign(node(data), { prev: element }), { data }
));
*/

// Usage

const obj1 = { name: 'first' };
const obj2 = { name: 'second' };
const obj3 = { name: 'third' };

//вызывая фцию node мы кладём туда первый объект -> она нам возвращает тоже функцию -> мы туда следующий объект
//в файле 2-single-factory мы явно указывали для создания каждого объекта предыдущий
const list = node(obj1)(obj2)(obj3);

console.dir(list, { depth: 3 });

/*
[Function: element] {
  data: { name: 'third' },
  prev: [Function: element] {
    data: { name: 'second' },
    prev: [Function: element] { data: { name: 'first' } }
  }
}
*/
