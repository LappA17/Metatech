'use strict';

const p1 = require('./Package1');
const p2 = require('./Package1/');
const p3 = require('./Package1/.');
const m1 = require('./Package1/main');
const m2 = require('./Package1/main.js'); //ЕСЛИ МЫ ПОДГРУЖАЕМ КОНКРЕТНЫЙ ФАЙЛ НЕ ИЗ ПЕКЕДЖА А КАК МОДУЛЬ ТО ВСЕГДАА УКАЗАЫВАТЬ РАСШИРЕНИЕ !
const u1 = require('./Package1/utils');
const u2 = require('./Package1/utils.js');
const j1 = require('./Package1/package');
const j2 = require('./Package1/package.json');

console.log({ p1, p2, p3, m1, m2, u1, u2, j1, j2 });

/*
{
  p1: { hint: 'Package1: main.js' },
  p2: { hint: 'Package1: main.js' },
  p3: { hint: 'Package1: main.js' },
  m1: { hint: 'Package1: main.js' },
  m2: { hint: 'Package1: main.js' },
  u1: { add: [Function: add] },
  u2: { add: [Function: add] },
  j1: { hint: 'Package1: package.js' },
  j2: {
    name: 'module-1',
    version: '1.0.0',
    author: 'Timur Shemsedinov <timur.shemsedinov@gmail.com>',
    main: 'main.js'
  }
} 

Во случаях с p1 до m2 резолвиться в { hint: 'Package1: main.js' }

const p1 = require('./Package1'); тут мы пишем относительный путь до каталога, система модульности поняла что нужно подгружать main.js потому что прочитала из main.js

const m1 = require('./Package1/main');
Потому что Нода будет подбирать, у нас там может лежать файл main.js, main.json, main.mjs, main.cjs и так далее

const m1 = require('./Package1/main');
const m2 = require('./Package1/main.js')
В этих двох случаях мы подгружаем файл как модуль, у нас не будет обрабатываться вообще через package json, потому что мы его подгружаем как буд-то мы обращаемся непосредственно к файлу на диске

const p1 = require('./Package1');
const p2 = require('./Package1/');
const p3 = require('./Package1/.');
А в этих трёх случаях мы обращаемся к каталогу, где лежит файл с названием package.json и какой будет подгружен js файл уже оттуда читается

const u1 = require('./Package1/utils');
const u2 = require('./Package1/utils.js');
Если мы хотим подгрузить вложенный файл утилс то мы пишем так, но оно сначало проверит а может у нас есть каталог утилс где лежит пакет json, utils.json и так далее и уже только потом проверит .js, по-этому что бы сократить кство обращение к диско нужно явно указывать utils.js. 
Но если мы лезем к Package то ничего не указываем и делаем package.json и делаем там точку входа 

const j1 = require('./Package1/package');
const j2 = require('./Package1/package.json');
j1 подгрузил  j1: { hint: 'Package1: package.js' },
а j2 уже наш json файл, потому что require умеет подгружать json файлы
*/
