'use strict';

const name = 'Marcus Aurelius';

console.log();
console.log(`name = ${name}`);

console.log();
console.log(`name.split(' ') = '${JSON.stringify(name.split(' '))}'`);
console.log(`name.replace('r', 'R') = '${name.replace('r', 'R')}'`); // первая r
console.log(`name.replace(/r/g, 'R') = '${name.replace(/r/g, 'R')}'`); // все r
console.log(`'Ave '.concat(name, '!') = '${'Ave '.concat(name, '!')}'`); // 'Ave '.concat(name, '!') = 'Ave Marcus Aurelius!' то-есть конкат есть не только у массивов
