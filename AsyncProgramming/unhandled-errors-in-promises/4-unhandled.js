'use strict';

// У нас просто крашнится приложение и console.log('after all'); не будет. Хотя в старой Ноде приложение бы дальше исполнялось и после огромной ошибки произошел бы тот console.log('after all'), но в нашей 18 Ноде такого больше нет и приложение крашится

const sum = (a, b) =>
  new Promise((resolve, reject) => {
    if (typeof a === 'number' && typeof b === 'number') {
      resolve(a + b);
    } else {
      reject(new Error('a and b should be numbers'));
    }
  });

sum(7, 'A').then((data) => {
  console.log({ data });
});

setTimeout(() => {
  console.log('after all');
}, 1000);

// UnhandledPromiseRejectionWarning: Error: a and b should be numbers
