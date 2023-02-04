'use strict';

// Antipattern: Fool-proof code
// Assumption: idiots will pass anything to my function
// мы допустим что наш код будут использовать идиоты и они будут передавать сюда не то что мы написали в документации, а начнут использовать нашу функцию неправильным использованием
// мы здесь в коде все проверяем
{
  const max = (...args) => {
    if (args.length !== 2) {
      throw new Error('Function expects two aruments');
    }
    const a = args.shift();
    if (typeof a !== 'number') {
      throw new Error('Unexpected type of first arument');
    }
    const b = args.shift();
    if (typeof b !== 'number') {
      throw new Error('Unexpected type of second arument');
    }
    return a > b ? a : b;
  };

  // Usage 1
  console.log(`Max of 10 and 20 is ${max(10, 20)}`);

  // Usage 2
  const a = new Number(10); // мы получим не число(тип) number, а объект [Number: 5]
  const b = new Number(20);
  console.log(`Max of ${a} and ${b} is ${max(a, b)}`);

  // Usage 3
  const x = {
    // Symbol.toPrimitive заберёт любое сколярное значение из любого бокса которое в нем лежит, к примеру из предыдущего примера [Number: 5] заберет 5ку !
    [Symbol.toPrimitive]() {
      return 10;
    },
  };
  const y = 20;
  console.log(`Max of ${x} and ${y} is ${max(x, y)}`);
}

// Solution
{
  const max = (a, b) => (a > b ? a : b); // без всяких лишних защит от дурока всё прекрасно работает, все достаточно безопасно

  // Usage 1
  console.log(`Max of 10 and 20 is ${max(10, 20)}`);

  // Usage 2
  const a = new Number(10);
  const b = new Number(20);
  console.log(`Max of ${a} and ${b} is ${max(a, b)}`);

  // Usage 3
  const x = {
    [Symbol.toPrimitive]() {
      return 10;
    },
  };
  const y = 20;
  console.log(`Max of ${x} and ${y} is ${max(x, y)}`);
}
