'use strict';

//в Ноде Таймеры не являются спецификацией ДжаваСкрипта и в Браузере тоже, те в браузере они создаются браузере, а в Ноде - Нода

const timers = require('node:timers');

console.log(Object.keys(timers));

//мы можем таймеры через библиотеку Таймерс вызывать
console.log('setTimeout === timers.setTimeout = ' + (setTimeout === timers.setTimeout));

console.dir({ setTimeout: setTimeout(() => {}, 0) });
console.dir({ setInterval: setInterval(() => {}, 0) });
console.dir({ setImmediate: setImmediate(() => {}) });
console.dir({ nextTick: process.nextTick(() => {}) });
