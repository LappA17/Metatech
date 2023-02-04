'use strict';

const sum = (a, b) =>
  new Promise((resolve, reject) => {
    if (typeof a === 'number' && typeof b === 'number') {
      resolve(a + b);
    } else {
      reject(new Error('a and b should be numbers'));
    }
  });

// Если у нас случилась ошибка то часть наших данных может быть испорченна и представь что нам нужно их где-то удалить.
// Удалять данные на Кетче опасно потому что может повлечь за собой генерацию цепочки других ошибок, по-этому лучше на finally чтобы проверить целосность данных и сделать какие-то действия

sum(7, 'A')
  .then((data) => {
    console.log({ data });
  })
  .catch((err) => {
    console.log({ messageCatch: err.message });
  })
  .finally(() => {
    console.log('finally');
  });
