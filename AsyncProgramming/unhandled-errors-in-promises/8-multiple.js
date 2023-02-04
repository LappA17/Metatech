'use strict';

// Есть и другая проблема - если несколько раз обработать catch или then - то это нормальная ситуация, то несколько раз сделать resolve или несколько раз сделать reject - то это уже ПЛОХО !
// это уже будет ошибка кода который мы написали на Промисах. По-этому мы повесим еще один обработчик multipleResolves, то-есть если мы сделаем несколько резолвов то у нас в Ноде будет вот такая штука multipleResolves

const sum = (a, b) =>
  new Promise((resolve, reject) => {
    if (typeof a === 'number' && typeof b === 'number') {
      resolve(a + b);
    } else {
      reject(new Error('a and b should be numbers'));
    }
  });

process.on('multipleResolves', (type, promise, reason) => {
  console.log({ multipleResolves: { type, promise, reason } });
});

sum(7, 3).then((res1) => {
  console.log({ res1 });
});

/*
  { res1: 10 } - ответ. То-есть результат пришел только ОДИН раз ! благодаря multipleResolves
  второй раз когда мы его резолвим уже прийдёт в событие multipleResolves где type: 'resolve', promise: Promise { 10 }, reason: 10
*/
