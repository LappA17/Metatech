'use strict';

import('Package4').then(result => {
	console.log(result);
});

import('Package4/utils.js').then(result => {
	console.log(result);
});

/*
    Мы так же можем указывать модульность, у нас в node_modules в Package4/package.json в "type":"module"
    Но точка входа у нас "main": "main.js"
    Тепреь у нас файл с расширением js тоже будет считаться экмаскрипт модулем ! То что Ларичев делал

    [Module: null prototype] { hint: 'Package4: main.js with ECMA export' }
    [Module: null prototype] { add: [Function: add] }
 */
