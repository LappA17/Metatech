'use strict';

// Здесь мы просто из нашего thenable переписали всё на Промисы

// У нас только одни 1чки будут возвращаться, потому что Промис только один раз резолвиться. Он один раз заходит в функцию которая называется executor
// executor - это вся лямбда от (resolve, reject) => { } которая приходит коллбеком в Промис
// один раз забирает оттуда элемент через shift() и возвращает его в резолв
// и потом сколько бы мы раз не делали с этим промисом await он все равно один и тот же будет возвращаться, потому что это значением уже разрешилось, оно переложилось в другую ячейку уже из массива и уже больше executor не будет призван и больше шифт он оттуда не сделает

const getNumbers = () => {
  const numbers = [1, 2, 3];
  return new Promise((resolve, reject) => {
    const num = numbers.shift();
    if (num) {
      resolve(num);
    } else {
      reject(new Error('I have no numbers for you'));
    }
  });
};

// Usage

(async () => {
  const data = getNumbers();
  for (let i = 0; i < 5; i++) {
    try {
      const res = await data;
      console.dir({ res });
    } catch (err) {
      console.dir({ err: err.message });
    }
  }
})();

/*
{ res: 1 }
{ res: 1 }
{ res: 1 }
{ res: 1 }
{ res: 1 }
*/
