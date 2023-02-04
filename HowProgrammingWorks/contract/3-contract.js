'use strict';

// Контракт - это протокол который в рантайме кем-то проверяется (хотя контракт не обязательно должен проверяться в рантайме, он может проверяться и в дизайн тайме или во-время тестов)

const assert = require('node:assert');

// Здесь у нас контракт в виде функции compare, которая принимает два аргумента. И мы точно хотим быть уверены что тип а и тип b - это числа, а результат точно boolean. И тут в коде мы императивно(некрасиво) написали эти проверки - поставили сюда assert
// проблема когда вот так вот пишешь императивный код что ты можешь наделать кучу ошибок в самих этих проверках.
// И если можно как-то декларативно описать контракт, то это всегда будет хорошо если есть такая возможность

const compare = (a, b) => {
  assert(typeof a === 'number');
  assert(typeof b === 'number');
  const result = a > b;
  assert(typeof result === 'boolean');
  return result;
};

{
  const result = compare(5, { a: 7 });
  console.log({ result });
}

/*{
  const result = compare(7, '5');
  console.log({ result });
}*/

/*
node:assert:400
    throw err;
    ^

AssertionError [ERR_ASSERTION]: The expression evaluated to a falsy value:

  assert(typeof b === 'number')

    at compare (/Users/Ruslan/Desktop/Work/timur-shemsedinov/HowProgrammingWorks/Contract/3-contract.js:11:3)
    at Object.<anonymous> (/Users/Ruslan/Desktop/Work/timur-shemsedinov/HowProgrammingWorks/Contract/3-contract.js:18:18)
    at Module._compile (node:internal/modules/cjs/loader:1126:14)
    at Object.Module._extensions..js (node:internal/modules/cjs/loader:1180:10)
    at Module.load (node:internal/modules/cjs/loader:1004:32)
    at Function.Module._load (node:internal/modules/cjs/loader:839:12)
    at Function.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:81:12)
    at node:internal/main/run_main_module:17:47 {
  generatedMessage: true,
  code: 'ERR_ASSERTION',
  actual: false,
  expected: true,
  operator: '=='
}
*/
