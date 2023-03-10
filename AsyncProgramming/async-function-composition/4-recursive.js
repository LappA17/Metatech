'use strict';

// В этом примере мы уже Композируем не 2 функции, а 3, а используется и во-все 4

// Здесь мы запихиваем все функции в массив ...fns и вернули тоже функцию (x, callback), те лямбда возвращает лямбду

const compose =
  (...fns) =>
  (x, callback) => {
    const fn = fns.shift(); // первую функцию берём шифтом(забрали первый элемент) из массива
    // если массив оказался пустой после того как мы одну фцию из него взяли
    if (fns.length === 0) {
      fn(x, callback); // то мы сразу эту фцию вызываем, даём ей аргумент и сразу навешиваем туда callback
      return; // и выходим
    }
    // иначе мы вызываем ту первую функцию из массива, даём ей аргумент
    // и так как это асинхронная фция с коллбеком и дальше там случится compose из оставшегося массива
    // получится что compose вызывается рекурсивно, сначало он вызовится над 4ма фциями -> потом мы одну взяли, применили, навесили коллбек, 3 фции объеденили в массив, передали их
    // в массив fns, распакаовали их там, compose их там забрал и опять новый compose и так пока фций в ...fns не останется ОДНА функция !
    // и как только там останется Одна функция - то вызовится окончательный callback который сюда приходит f(res, callback);
    fn(x, (err, res) => {
      if (err) {
        callback(err);
        return;
      }
      const f = compose(...fns);
      f(res, callback);
    });
  };

// Usage

// все эти функции Чистые и их через асинхронную композицию совершенно бесполезно вызывать, но можем считать что мы можем заменить эти математические функции, на функции которые что-то делают асинхронно(обращать к апи, к бд, что-то асинхронное)

const inc = (x, callback) => callback(null, x + 1);
const twice = (x, callback) => callback(null, x * 2);
const square = (x, callback) => callback(null, x * x);

const f = compose(inc, twice, square, inc);

f(7, (err, res) => {
  console.log({ res });
});

// { res: 257 }
