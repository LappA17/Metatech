'use strict';

const sum = (a, b) =>
  new Promise((resolve, reject) => {
    if (typeof a === 'number' && typeof b === 'number') {
      resolve(a + b);
    } else {
      reject(new Error('a and b should be numbers'));
    }
  });

// Чем отличается обработка ошибки catch и вторым аргументом в then ?
// у них есть некоторый приоритет, ошибка сначало всегда прийдёт во второй аргумент then если мы его указали
// Но обрати внимание что мы после первого catch сделали еще одну ошибку throw new Error('Oh, noo!'); и куда же она пойдёт ?
// у нас в then первый аргумент пустая лямбда, а вторым аргументом идёт обработка ошибки в then и ошибка которая выйдет из предыдщуего catch пойдет во второй аргумент then если он есть и если внутри then случится ошибки то после неё мы опять можем catch ее обработать

// ВЫВОД: гораздо лучше обрабатывать ошибку вторым аргументом в then, но при этом catch тоже навесить, то-есть опасные обработчики лучше в then навешивать вторым аргументом, а безопасные уже в catch что бы точно на верочку не было ошибки !!!

sum(7, 'A')
  .then(
    (data) => {
      console.log({ data });
    },
    (err) => {
      console.log({ messageThen: err.message });
      throw new Error('Oh, no!');
    }
  )
  .catch((err) => {
    console.log({ messageCatch1: err.message });
    throw new Error('Oh, noo!');
  })
  .then(
    () => {},
    (err) => {
      console.log({ messageThen2: err.message });
      throw new Error('Oh, nooo!');
    }
  )
  .catch((err) => {
    console.log({ messageCatch2: err.message });
  });
