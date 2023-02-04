'use strict';

const { sin } = Math;
const π = Math.PI;

// мы хотим наш синус приобразовать в cosecant

const inverse = (f) => (x) => 1 / f(x);

// в данном случае inverse является хок потому что мы в неё передаём фцию sin и на выход получаем фцию cosecant
// в данном случае наш хок синхронный, но хок очень часто используется для асинхронных вычесленний

const cosecant = inverse(sin);

const a = cosecant(0.25);
console.log('cosecant(0.25) =', a);

const sin2 = inverse(cosecant);

console.log('sin(0) =', sin(0), '=', sin2(0));
console.log('sin(π / 2) =', sin(π / 2), '=', sin2(π / 2));
console.log('sin(π / 4) =', sin(π / 4), '=', sin2(π / 4));
