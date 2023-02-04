'use strict';

const numbers = [7, 10, 1, 5, 2];
numbers.field2 = 'Value2'; // добавляем массиву numbers как буд-то объекту через точку поле field2 со значение Value2
numbers[-10] = 'Value3'; // через квадратные скобочки асициотивного массива добавляем Value3
numbers.field1 = 'Value1';
numbers[5] = 20; // 5 индекс(ключ) будет 20

Object.defineProperty(numbers, 'newField', {
  enumerable: false,
  value: 'valueOfNewField',
});

Object.prototype.inheritedProperty = 'inherited';

for (const i in numbers) {
  const value = numbers[i];
  console.log(i, typeof i, value);
}

console.log(numbers);

/*
0 string 7
1 string 10
2 string 1
3 string 5
4 string 2
5 string 20
field2 string Value2
-10 string Value3
field1 string Value1
inheritedProperty string inherited

[
  7,
  10,
  1,
  5,
  2,
  20, это наш numbers[5] = 20;
  field2: 'Value2',
  '-10': 'Value3',
  field1: 'Value1'
]

Если мы обратим внимание то после 20 у нас в массиве прекрасно проиттерировались ключи которые не являются индексами(-10, field2, field1) !! И они все идут ПОСЛЕ числовых индексов, хотя создались раньше 20ки
НО если бы мы проходились циклом for of то у нас бы появились только 7, 10, 1, 5, 2, 20, а -10, field2, field1 уже бы не было !
*/
