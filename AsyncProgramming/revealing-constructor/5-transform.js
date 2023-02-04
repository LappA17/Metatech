'use strict';

const fs = require('node:fs');
const { Transform } = require('node:stream');

// И writeable и transform и duplex стримы можно объявлять при помощи этого паттерна
// если мы пишем writeable стрим то мы даём в конструктор объект у которого будет метод write, в прошлом примере это был объект с методом read, если duplex стрим то мы оба переопределяем и read и write, если трансформ то как в нашем примере фцию transform

// Здесь у нас upper стрим, который умеет делать все буквы заглавными

class UpperStream extends Transform {
  _transform(chunk, encoding, callback) {
    callback(null, chunk.toString().toUpperCase());
  }
}

const upperStream = new UpperStream();

const source = fs.createReadStream('./5-transform.js');
source.pipe(upperStream).pipe(process.stdout);

/*
'USE STRICT';

CONST FS = REQUIRE('NODE:FS');
CONST { TRANSFORM } = REQUIRE('NODE:STREAM');

CLASS UPPERSTREAM EXTENDS TRANSFORM {
  _TRANSFORM(CHUNK, ENCODING, CALLBACK) {
    CALLBACK(NULL, CHUNK.TOSTRING().TOUPPERCASE());
  }
}

CONST UPPERSTREAM = NEW UPPERSTREAM();

CONST SOURCE = FS.CREATEREADSTREAM('./5-TRANSFORM.JS');
SOURCE.PIPE(UPPERSTREAM).PIPE(PROCESS.STDOUT); 
*/
