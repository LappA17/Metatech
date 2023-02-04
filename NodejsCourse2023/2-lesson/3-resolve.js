const exp = require('./1-export.js');
const expPath = require.resolve('./1-export.js');
const expModule = require.cache[expPath];
console.log({ exp, expPath, expModule }); //это модуль внешний

const events = require('node:events');
const eventsPath = require.resolve('node:events');
const eventsModule = require.cache[eventsPath];
console.log({ events, eventsPath, eventsModule }); //выводит вложенну библиотеку

/*
require.resolve() - позволяет относительный путь к файлу, пакету или модулю преобразовать в абсолютный путь
require.cache - это коллекция, и она позволяет по ключу из этой коллекции вычитать все модули которые там закешированы

*/
