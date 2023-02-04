'use strict';

require('./5-singleton.js');

const { collection } = require('./1-export.js');
console.log(collection);

/*
Мы подгружаем файл Синглтона, который в свою очередь подгружает один экспорт, задает туда ключ(модифицирует эту коллекцию)
и мы уже отсюда берем эту коллекцию, но уже с ключом 
Это значит что один и тот же collection возвращается из этого require - require('./5-singleton.js'); и из require - const { collection } = require('./1-export.js');

Map(1) { 'key1' => 'value1' }
ВОТ !!! 
Этот ключ выводит из 6го примера, а сам ключ задается в 5ом
*/
