'use strict';

// так как и фукнция inc принимает аргумент и возвращает Промис и так же функция twice, то что бы нам их скомпозировать нам нужно перед каждым из этих вызовах поставить await
// сначало случится await f1(), и этот результат попадёт в await f2()

const compose = (f1, f2) => async (x) => await f2(await f1(x));

// Usage

// то что функции inc и twice посчитают вернуться из этой функции в виде промиса

const inc = async (x) => x + 1;
const twice = async (x) => x * 2;

// f - у нас это скомпозированные две функции inc и twice

const f = compose(inc, twice);

(async () => {
  const res = await f(7); // await подождет Промис и расспакует значение(или значение могли бы с помощью then расспаковать)
  console.dir({ res });
})();
