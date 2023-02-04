'use strict';

// Этот генератор будет нам генерировать числа от begin до end с шагом в delta
// так как это функция - у неё есть контекст и мы можем через let завести переменную value - это будет то с чего мы начинаем
// и мы будем возвращать значение на каждой иттераци не через return а через yield

function* counter(begin, end, delta = 1) {
  let value = begin;
  while (end > value) {
    value += delta;
    if (value > end) return;
    yield value;
  }
}

const c = counter(0, 30, 12); // c - это объект возвращенный из функции генератор
//теперь мы у этого c много раз вызовим next()
const val1 = c.next();
const val2 = c.next();
const val3 = c.next();
const val4 = c.next();
console.log({ c, val1, val2, val3, val4 });

/*
{
  c: Object [Generator] {}, - сам генератор это объект класса Генератор
  val1: { value: 12, done: false }, - done: false значит что там еще что-то есть и он собирается нам еще какие-то значения вернуть ! То-есть можно еще раз вызвать next()
  val2: { value: 24, done: false },
  val3: { value: undefined, done: true }, - и вот с какого-то момента нам возвращает value: undefined и done: true - значит иттерирование закончилось и то значение которое вернулось 
                                            из  next() когда done уже в true то оно уже должно игнорироваться
  val4: { value: undefined, done: true }
}
  Обрати внимание что мы два лишиних раза вызываем next() и это нормальное дело потому что если иттератор уже закончился то он должен нам отдавать что done: true. То-есть пока у нас есть ссылка на этот иттерируемый объект то он нам всё время будет отдавать что done: true, а не какой-то там null или undefined
*/
