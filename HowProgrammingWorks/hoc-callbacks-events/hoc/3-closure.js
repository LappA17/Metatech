'use strict';

// Здесь хок порождается на замыкание

const fn = (a) => {
  const b = 'Closure variable';
  return (c) => {
    console.dir({ a, b, c });
  };
};

const f1 = fn('Parameter 1');
f1('Parameter 2');

const f2 = fn('Parameter X');
f2('Parameter Y');

/*
{ a: 'Parameter 1', b: 'Closure variable', c: 'Parameter 2' }
{ a: 'Parameter X', b: 'Closure variable', c: 'Parameter Y' }
*/
