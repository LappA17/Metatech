'use strict';

const { collection } = require('./1-export.js');

collection.set('key1', 'value1');

/*
Здесь будет доказательство того что рекваер работает как Singleton
Мы берем из первого примера ключ collection и мы устанавливаем в него ключ
Сама коллекция пустая, мы туда ничего не пишем */
