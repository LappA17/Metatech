'use strict';

//hrtime - high resolution timer который есть в Ноде
const begin = process.hrtime.bigint();

const diff = end => (end - begin) / 1000000n; //делим на 1000000n что бы получить секундыы

setTimeout(() => {
  const end = process.hrtime.bigint();
  console.log('  10ms: ' + diff(end));
}, 10);

setTimeout(() => {
  const end = process.hrtime.bigint();
  console.log(' 100ms: ' + diff(end));
}, 100);

setTimeout(() => {
  const end = process.hrtime.bigint();
  console.log(' 500ms: ' + diff(end));
}, 500);

setTimeout(() => {
  const end = process.hrtime.bigint();
  console.log('1000ms: ' + diff(end));
}, 1000);
