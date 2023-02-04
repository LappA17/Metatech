'use strict';

const p6 = require('Package6');
console.log({ p6 });

import('Package6').then(result => {
	console.log(result);
});

/*
Но мы хотим делать такие модули где одновременно у них будут и экмаскрипт и коммонjs те и через рекваер и через импорт можно будет подгрузить
"exports": {
    "import": "./main.mjs",
    "require": "./main.cjs"
 }
 То-есть для импорта и для рекваера(main.cjs) две разные точки входа 

    { p6: { hint: 'Package6: main.cjs' } }
    Module: null prototype] { hint: 'Package6: main.mjs' }

*/
