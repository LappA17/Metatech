'use strict';

const fs = require('node:fs');

// Antipattern: Improbability
// Assumption: file always exists
// Иногда нам кажется что что-то в коде не может случиться, здесь в примере у нас есть допущение что файл всегда существует и мы предпологаем что не может быть таких случаев что этого файла нет, и из-за того что нам кажется что файл всегда существует мы не обрабатываем параметр фции err. А просто решается эта проблема if (err) throw new Error(err)
{
  fs.readFile('./filename.ext', 'utf8', (err, data) => {
    const found = data.includes('substring');
    console.dir({ found });
  });
}

// Antipattern: Improbability
// Assumption: json format, field `port` exists and type is `number`
// Тут мы допускаем что хоть файл и есть, а еще мы допускаем что файл в JSON формате, а наружный объект который хранится в json файле не всегда может быть Объектом, а может быть к примеру массивом
{
  fs.readFile('./config.js', 'utf8', (err, data) => {
    const config = JSON.parse(data); // JSON.parse может обрушится потому что у нас может быть не JSON в файле data, а что-то другое
    // по хорошему сделать parseInt потому что вдруг кто-то порт строчкой записал сюда
    const { port } = config;
    console.dir({ port });
  });
}
