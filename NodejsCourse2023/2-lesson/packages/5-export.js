'use strict';

import('Package5').then(result => {
	console.log(result);
});

import('Package5/utils').then(result => {
	console.log(result);
});
/*
    Здесь тоже прописанно что у нас 
    "type":"module"
    "main": "main.js"
    Но у нас есть несколько точек входа

    "exports": {
        ".": "./main.js", То-есть тут корень ссылается на main.js
        "./utils": "./utils.js" А если будем загружать этот модуль слеш утилс то точка входа util.js
    }

    [Module: null prototype] { hint: 'Package5: main.js with ECMA export' }
    [Module: null prototype] { add: [Function: add] } утилс отработал 
*/
