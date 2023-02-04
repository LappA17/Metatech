'use strict';

function* range(first, second, step = 1) {
  let current, end;

  if (second === undefined) {
    // если в second как второй аргумент ничего не передали то иттерация будет идти от 0 до числа first
    current = 0;
    end = first;
  } else {
    // если передали то иттерация будет идти от первого до второго аргумента
    current = first;
    end = second;
  }

  if (step > 0) {
    while (current < end) {
      yield current;
      current += step;
    }
  } else {
    while (current > end) {
      yield current;
      current += step;
    }
  }
}

console.log([[...range(10)], [...range(3, 18)], [...range(2, 15, 2)], [...range(10, 0, -1)]]);

/*
[
  [
    0, 1, 2, 3, 4,
    5, 6, 7, 8, 9
  ],
  [
     3,  4,  5,  6,  7,  8,
     9, 10, 11, 12, 13, 14,
    15, 16, 17
  ],
  [
     2,  4,  6, 8,
    10, 12, 14
  ],
  [
    10, 9, 8, 7, 6,
     5, 4, 3, 2, 1
  ]
]
*/
