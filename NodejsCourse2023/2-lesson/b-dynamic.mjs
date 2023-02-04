'use strict';

const promise = import('node:events');
console.log({ promise });

promise.then(events => console.log({ defaultMaxListeners: events.defaultMaxListeners }));

/*
Ещё динамически импорты только из файла который сам является commonjs файлом
Динамический импорт точно так же работает, он точно так же возвращает Промис, контракт такой же самый, то-есть можно писать await, но не в корне, если мы тут const promise = import('node:events'); напишем await то получим что извините но у нас в коммонjs модулях топ левел await не работает

{ promise: Promise { <pending> } }
{ defaultMaxListeners: 10 }*/
