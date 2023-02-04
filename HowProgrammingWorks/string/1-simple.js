'use strict';

const name = 'Marcus Aurelius';

// Все методы строки прицеплены не к самому Объекту строки а к String.prototype

console.log();
console.log(`name = '${name}'`); // никогда нельзя просто так пехать бектики, только если нужно вставить в внутрь переменную, если просто строку пишешь то всегда использовать одинарные ковычки что бы html и css не перемешались потом, а если везде буду тыкать бектики то такая строка дольше будет джаваскриптом обробатываться, потому что js там будет искать переменную !!

console.log();
console.log(`typeof name = '${typeof name}'`);
console.log(`name.length = ${name.length}`);
console.log(`name[3] = '${name[3]}'`);
console.log(`name.charAt(5) = '${name.charAt(5)}'`); // s вернулась строчка с одним символов потому что в js нет у нас типа char
console.log(`name.charCodeAt(7) = ${name.charCodeAt(7)}`); // 65 символ буквы A из name
