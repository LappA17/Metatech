'use strict';

//все иттераторы блокируют к сожалению основной поток, а если нам нужно большой ДАТА-СЕТ приобразовывать в памяти, нам нужно что-то сделать что бы мы могли обрабатывать ВВОД-ВЫВОД и что бы паралельные все опперации которые происходят паралельно с приобразованием нашего ДАТА-СЕТа они тоже должны работать, то-есть нужно отдавать квант времени в ЕвентЛуп что бы они перераспределялись на другие опперации

const number = new Array(1000).fill(1);

//хоть сетТаймаут и 0 но сначало проиттерируется массив и пройдет прилично времени
setTimeout(() => {
  console.log('setTimeout 0');
}, 0);

numbers.forEach((item, i) => {
  console.log(i);
});
