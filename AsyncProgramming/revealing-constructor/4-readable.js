'use strict';

const crypto = require('node:crypto');
const { Readable } = require('node:stream');

// Здесь уже используется паттерн открытый конструктор
// то-есть мы можем асболютно не наследовать randomStream от Readable
// а можно просто в конструктор Readable передать объект, у которого будет метод read, и он там внутри себя заинжектит(этот очень похоже на внедренее зависимостей, только тут внедряется одна фция во внтурь экземпляра Readable)
// то-есть наш randomStream - не экземпляр рендомСтрима, а он обычный экземпляр Readable, и в этот Readable мы смогли через конструктор внедрить фцию read
// и реализация стримов которая у нас вставленна в нативную библиотеку в NodeJS именно такая реализация и сделанна

const randomStream = new Readable({
  read(size = 1) {
    const buffer = Buffer.alloc(size);
    crypto.randomFillSync(buffer);
    this.push(buffer.toString('hex'));
  },
});

const data = randomStream.read(10);
console.log(data);

// так же мы можем randomStream запайпить в stdout и получить бесконечную белибироду на экране, он будет генерировать все эти числа и писать нам их в консоль.
// почему это происходит ? потому что как только случается pipe() то сразу же Readable пытается вычитать из фции read() сколько может и потом всё это пайпит в writeableStream(в stdout)

//randomStream.pipe(process.stdout);

/*
    <Buffer 65 65 33 32 36 65 65 34 39 64>
*/
