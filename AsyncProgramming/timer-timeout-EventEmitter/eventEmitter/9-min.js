'use strict';

//здесь мы напишем все что было в 8 примере только чуть короче, но так писать нельзя :)

//мы здесь сразу объявляем две переменные в фциональнмо стиле (l, o) но проблема в том что в фциональном стиле мы не можем создавать переменных, циклов, те ничего нету и последовательность опперации нету, а что бы создать переменные - мы их делаем аргументами, те мы в emitter не будем передавать никаких аргументов, но в аргументах мы можем создать две переменные
//дальше в этой лямбде нет никакого блока опператора, из неё возвращается сразу объект o = {} То-есть сразу как мы создали l и о вот здесь (l, o) то мы сразу их перезатерлся, сказав что l будем пустым объектом, а в переменную о помещаем объект с методами on, emit и тд. Таким образом нам никто не сможет нам прислать каких-то аргументов в emitter наш. Так же благодаря замыканию аргументы l и о будут видны всем фциям которые мы объявляем внутри о: on, emit и тд, таким образом мы из нутри самого объекта o и самого эмиттера сможем писать o.remove или o.once
const emitter = (l, o) => (
  (l = {}),
  (o = {
    on: (n, f) => (l[n] = l[n] || []).push(f),
    emit: (n, ...d) => (l[n] || []).map(f => f(...d)), //здесь можно было бы forEach сделать но map меньше букв занимает
    //мы в once вызываем фцию on что бы навесить событие и сразу первым аргументом буквой n передаём имя события, а дальше передаём фцию g где раньше мы объявляли её отдельной строчка а здесь сразу. Но фция g нам нужна по имени, по-этому мы её присваиваем в переменную g что бы внутри самой фции g её саму и вызвать вот здесь o.remove(n, g)
    once: (n, f, g) => o.on(n, (g = (...a) => (f(...a), o.remove(n, g)))),
    remove: (n, f, e) => ((e = l[n] || []), e.splice(e.indexOf(f), 1)),
    clear: n => (n ? delete l[n] : (l = {})),
    count: n => (l[n] || []).length,
    listeners: n => (l[n] || []).slice(),
    names: () => Object.keys(l),
  })
);

// Usage

const ee = emitter();

// on and emit

ee.on('e1', data => {
  console.dir(data);
});

ee.emit('e1', { msg: 'e1 ok' });

// once

ee.once('e2', data => {
  console.dir(data);
});

ee.emit('e2', { msg: 'e2 ok' });
ee.emit('e2', { msg: 'e2 not ok' });

// remove

const f3 = data => {
  console.dir(data);
};

ee.on('e3', f3);
ee.remove('e3', f3);
ee.emit('e3', { msg: 'e3 not ok' });

// count

ee.on('e4', () => {});
ee.on('e4', () => {});
console.log('e4 count', ee.count('e4'));

// clear

ee.clear('e4');
ee.emit('e4', { msg: 'e4 not ok' });
ee.emit('e1', { msg: 'e1 ok' });

ee.clear();
ee.emit('e1', { msg: 'e1 not ok' });

// listeners and names

ee.on('e5', () => {});
ee.on('e5', () => {});
ee.on('e6', () => {});
ee.on('e7', () => {});

console.log('listeners', ee.listeners('e5'));
console.log('names', ee.names());
