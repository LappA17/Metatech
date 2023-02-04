'use strict';

const fs = require('node:fs');

const print = (fileName, err, data) => {
  console.log({ lines: data.split('\n').length });
};

const fileName = './1-callback.js';

const callback = print.bind(null, fileName); // мы прибиндили потому что фция print не знает какой именно файл мы считывали, по той приччине что даже переменная в которую кладется имя файл объявлется позже чем эта фция. Так же мы делаем бинд потому что readFile предпологает что в коллбеке будет два аргумента(error first, callback last), а с помощью bind мы указыаем что у нас 3 аргумента
fs.readFile(fileName, 'utf8', callback); // readFiel - у нас хок, а фция print уже не будет коллбеком ! Коллбеком будет та фция которая нам вернет частичное применение, которую bind вернет - print.bind(null, fileName); ! То-есть мы не фцию print делаем коллбеком, а поражденую от неё
