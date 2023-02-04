const m1 = await import('module');
const m2 = await import('module');
import m3 from 'module';
import m4 from 'module';

const { createRequire } = m2;
const require = createRequire(import.meta.url);

const m5 = require('module');
const m6 = require('module');

console.log(m3 === m6);

const c7 = require('Package7');
const m7 = await import('Package7');

console.log({ c7, m7 });

/* Делаем такой пекедж который будет загружатся кандишонал способом из экма-скрипт модулей

true
{
  c7: { hint: 'Package6: main.cjs' },
  m7: [Module: null prototype] { hint: 'Package6: main.mjs' }
}

Мы здесь два раза его импортируем через динамический импорт и дав раза импортируе через директиву импорт
const m1 = await import('module');
const m2 = await import('module');
import m3 from 'module';
import m4 from 'module';

Потом мы хотим сравнить буду ли это одинаковые m1 и m2 или разные

const require = createRequire(import.meta.url); - мы берём createRequire из m2, диструктуризацию сделали

потом мы сделали себе еще рекваер const require = createRequire(import.meta.url);

потом при помощт рекваер загрузили еще два модуля 
const m5 = require('module');
const m6 = require('module');

import m3 from 'module'; - м3 это у нас ссылка на встроенную библиотеку Модуль в Ноду 
const m6 = require('module'); - а m6 это ссылка на библиотеку модуля но загруженную уже при помощи require
Это нам поможет выяснить используют ли импорты и рекваеры один и тот же Кеш

А здесь мы уже проверим использует ли рекваер или динамический импорт тоже один кеш
const c7 = require('Package7');
const m7 = await import('Package7');

Директивна Импорт и Рекваер - у них Кеш будет Один, а вот Динамический импорт - он свой Отдельный Кеш 
с7 и м7 будут очень разными
Так происходит потому что у нас этот package имеет две разные точки входа , если мы его загружаем через require - то там одна точка входа, а если через динамический импорт то другая


ЗНАЯ ТЕПЕРЬ ВСË ЭТО МЫ В БУДУЩЕМ КОГДА БУДЕТ ДЕЛАТЬ ПРОЕКТ, МЫ БУДЕМ РАЗМЕЩАТЬ И ПОДГРУЖАТЬ ВСЕ НАШИ КЛАССЫ, ФЦИИ И ТД ТАКИМ ОБРАЗОМ, ЧТО БЫ У НАС БИЗНЕСС ЛОГИКА, КОТОРАЯ У НАС В ПРИЛОЖЕНИЕ КАК МОЖНО МЕНЬШЕ ЗНАЛА ПРО ДЕТАЛИ РЕАЛИЗАЦИИ, ПО ПРИНЦИПАМ ЧИСТОЙ АРХИТЕКТУРЫ, ВОТ СИСТЕМЕА МОДУЛЬНОСТИ НАМ ЭТО ПОЗВОЛИТ СДЕЛАТЬ
КРОМЕ ЭТОГО НАШИ sandbox ПОЗВОЛЯТ СДЕЛАТЬ ВНУДРЕНИЯ ЗАВИСИМОСТЕЙ ЧЕРЕЗ СЕНДБОКСЫ
*/
