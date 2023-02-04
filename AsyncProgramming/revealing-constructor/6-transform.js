'use strict';

// пример с открытым конструктором

const fs = require('node:fs');
const { Transform } = require('node:stream');

const upperStream = new Transform({
  transform(chunk, encoding, callback) {
    callback(null, chunk.toString().toUpperCase());
  },
});

const source = fs.createReadStream('./6-transform.js');
source.pipe(upperStream).pipe(process.stdout);

/*
USE STRICT';

CONST FS = REQUIRE('NODE:FS');
CONST { TRANSFORM } = REQUIRE('NODE:STREAM');

CONST UPPERSTREAM = NEW TRANSFORM({
  TRANSFORM(CHUNK, ENCODING, CALLBACK) {
    CALLBACK(NULL, CHUNK.TOSTRING().TOUPPERCASE());
  },
});

CONST SOURCE = FS.CREATEREADSTREAM('./6-TRANSFORM.JS');
SOURCE.PIPE(UPPERSTREAM).PIPE(PROCESS.STDOUT);
*/
