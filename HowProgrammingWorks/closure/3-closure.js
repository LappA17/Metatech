'use strict';

const add = (x) => (y) => {
  const z = x + y;
  console.log(`${x} + ${y} = ${z}`);
  return z;
};

// const add = x => y => x + y; // та же самая фция только в одну строчку

// Usage

const res = add(3)(6); // 3 в x, а y в 6
console.log(res);
