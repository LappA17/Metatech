'use strict';

const ex1 = require('./1-export');
const modulePath = require.resolve('./1-export.js');
console.log({ required: modulePath });
console.log(require.cache[modulePath]);
delete require.cache[modulePath];
console.log({ cached: require.cache[modulePath] });
const ex2 = require('./1-export');
console.log(ex1 === ex2);

const ws = require('ws');
const wsPath = require.resolve('ws');
console.log(ws, wsPath);
console.log(Object.keys(require.cache));

/*Как мы можем этим кешом манипулировать
Мы можем очищать кеш потому что однадны подгруженная библиотека она остается в кеше и сидит там в виде singleton
const modulePath = require.resolve('./1-export.js'); - если мы загрузили наш такой jsный файликЮ он экспортирует объект. Мы в одном месте приложения сделали require и в другом месте приложения сделали require - и мы в обоих местах получили указатель на один и тот же Объект и если мы меняем его в одном месте то в другом он тоже меняется. Если такое произойдет с библиотекой встроенной из npm, или с библиотекой встроенной в Ноду. К примеру мы в одном месте подгрузили ее через require, а кто-то другой из нутри зависимостей кто-то тоже сделал require и он оттуда из своего модуля может что-то перемешать, модфицировать ключи и изменить библиотеку. Получается что нам рекваер возвращает один и тот же Объект и даже если мы два раза сделали рекваер из разных мест и уже после этих рекваеров меняем объект то всё равно измененный в одном месте(потому что это ссылка) будет изменен во всех местах где был использован require. По-этому рекваер - это синглтон, её можно применять вместо глобального кнтекста, если мы привыкли какие-то индефикаторы примешивать к глобалу, то делать это безсмысленно и мы можем сделать себе специальную такую библиотечку, подгружать её через require, примешивать чет к ней и это будет тоже самое что и глобал, то-есть это не очень хорошая практика. 
Лучше всего что бы всё что у нас возвращается из библиотек - не менялась в процессе работы приложения, иначе получится что везде нужно ставить if и проверять то ли мы ожидаем
Таким образом мы понимаем что у модулей должны быть четко заданы контракты и в середине работы приложения они вдруг не должны меняться 

delete require.cache[modulePath]; - мы из require.cache может что-то еще и улалить, он удалится из кеша
const ex2 = require('./1-export'); - потом мы еще раз подгрузим этот модуль
console.log(ex1 === ex2); и потом когда мы будем сравнивать рекваер до удаление кеша и после то мы получим разные ссылки, то-есть если мы очищаем кеш то таким образом модуль загружается второй раз
Таким образом мы можем избежать кеширование или синглтона, но это не полностью обезопашивает нас и мы точно не можем знать может быть кто-то успел загрузить свой модуль, какая-то другая зависимость могла успеть загрузить свой модуль до того как мы сделали удаление из кеша, а может быть еще до нас она это сделала, после нас это сделать. Вообщем полагаться что мы после очистка кеша сделаем модули иммутабильными, чистыми и какая-то зависимость не сможет наделать там миксинов, обёрток и прочьих конткрукций которых мы не ожидаем мы не можем

Что касаетс веб-сокетов, то мы выведем все ключи которые у нее есть и абсолютный путь точки входа в эта библиотеку

*/
