'use strict';

const name = 'Marcus Aurelius';

console.log();
console.log(`name = ${name}`);

// Polyfill

// бывают такие случае что метода includes в движке ДжаваСкрипта нет, по-этому мы можем сделать Полифил и модифицировать prototype строки. Случай когда мы можем модифицировать прототайп строки - это только тот случай когда мы хотим и можем реализовать при помощи других методов, которые уже встроенные в ДжаваСкрипт спецификацию, которая у нас объявленна в экмаскрипте ! Потому что ниже в Bad practice мы доделали метод includesWord, который ищет в строке слово которое с двух сторон пробелами ограничен и это плохой случай потому что мы изменили спеицфикацию JS !! А если мы сделали такой метод как includes который есть в новых движках js но в старых нет, то это хорошо потому что мы его реализовали таким же образом как и в новых стандартах экмаскрипт, и нам Полифил эмулирует буд-то мы пишем на новом js и мы все равно делаем проверку есть ли такой метод как includes !

if (!String.prototype.includes) {
  String.prototype.includes = function (s) {
    return this.indexOf(s) > -1;
  };
}

console.log(name.includes('Mar'));

// Bad practice

String.prototype.includesWord = function (s) {
  return ` ${this} `.includes(` ${s} `);
};

console.log(name.includesWord('Mar'));
