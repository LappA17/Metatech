'use strict';

// в этом примере мы будем читать из стрима, но без Паттерна Открытый Конкструктор ! Уже в 4 примере будет на примере с паттерном

// Где это еще может применяться ?
// Может применяться в Стримах(как в у нас в Ноде, в js есть стримы)

const crypto = require('node:crypto');
const { Readable } = require('node:stream');

// мы унаследовали от Readable стрима
// переопределили у него метод _read

class RandomStream extends Readable {
  _read(size = 1) {
    // здесь мы генерируем массив необходимой нам длины, сколько из этого стрима вычитать
    const buffer = Buffer.alloc(size);
    // заполняем этот массив рандомными значениями
    crypto.randomFillSync(buffer);
    //и пушем их в Буффер этого Readable стрима, причем еще и превращеный в 16ти значную строку
    this.push(buffer.toString('hex'));
  }
}

const randomStream = new RandomStream();

// читаем из стрима 10 байтов

const data = randomStream.read(10);
console.log(data);

//randomStream.pipe(process.stdout);
