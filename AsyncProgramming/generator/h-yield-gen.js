'use strict';

function* gen1() {
  yield 10;
  yield 20;
  yield 30;
}

function* gen2() {
  yield 40;
  yield 50;
  yield 60;
}

function* genFn() {
  yield* gen1(); //здесь начал генератор1 иттерироваться и потом продолжил 2
  yield* gen2();
}

console.log('[...genFn()] =', [...genFn()]);

// [...genFn()] = [ 10, 20, 30, 40, 50, 60 ]
