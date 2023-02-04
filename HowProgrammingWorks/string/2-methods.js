'use strict';

console.log(`'A'.repeat(5) = '${'A'.repeat(5)}'`);
console.log(`'  ABC   '.trim() = '${'  ABC   '.trim()}'`);
console.log(`'  ABC   '.trimLeft() = '${'  ABC   '.trimLeft()}'`);
console.log(`'  ABC   '.trimRight() = '${'  ABC   '.trimRight()}'`);
console.log(`'Hello'.toLowerCase() = '${'hello'.toLowerCase()}'`);
console.log(`'Hello'.toUpperCase() = '${'hello'.toUpperCase()}'`);
console.log(`String.fromCharCode(80) = '${String.fromCharCode(80)}'`); // обрати внимание что это метод не String.prototype, а String.fromCharCode, те это метод класса и его методы делятся на методы Прототипа и его методы потом делятся каждой строкой, те если мы напишем строку 'hello' то у нее не будет метода fromCharCode, но у класса будет
