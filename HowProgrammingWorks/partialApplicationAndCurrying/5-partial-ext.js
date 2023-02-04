'use strict';

// Здесь мы уже расшириим partial, нам не нужно будет теперь передавать по одному аргумента в Х как в предыдущем примере, а просто ...args, то-есть сколько хоти столько и передаём

const partial =
  (fn, ...args) =>
  (...rest) =>
    fn(...args, ...rest); // можно так же было прописать ...args.concat(rest)

// Usage

const sum4 = (a, b, c, d) => a + b + c + d;

// У нас всё равно есть проблема, нам что бюы закреплять какие-то аргументы у фции - нужно каждый раз вызывать partial ! Нам бы хотелось вызвать partial один раз

const f11 = partial(sum4, 1);
const f12 = partial(f11, 2);
const f13 = partial(f12, 3);
const y1 = f13(4);
console.log(y1); // 10

const f21 = partial(sum4, 1, 2); // теперь мы сможем 1, 2 через запятую передать
const f22 = partial(f21, 3);
const y2 = f22(4);
console.log(y2); // 10
