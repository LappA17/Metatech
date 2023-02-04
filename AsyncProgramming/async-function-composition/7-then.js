'use strict';

// Здесь сами фции inc, twice и тд объявлены через async, а сама фция compose реализован при помощи Promise и then, без асинк-евейтов
// это нам говорит что оба эти способа совместимы, у них одинаковый контракт

const compose =
  (...fns) =>
  (x) => {
    const fn = fns.shift();
    if (fns.length === 0) return fn(x);
    return fn(x).then((res) => compose(...fns)(res));
  };

// Usage

const inc = async (x) => x + 1;
const twice = async (x) => x * 2;
const square = async (x) => x * x;

const f = compose(inc, twice, square, inc);

(async () => {
  const res = await f(7);
  console.dir({ res });
})();
