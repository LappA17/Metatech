'use strict';

const p1 = require('Package2');
const p2 = require('Package2/');
const p3 = require('Package2/.');
const m1 = require('Package2/main');
const m2 = require('Package2/main.js');
const u1 = require('Package2/utils');
const u2 = require('Package2/utils.js');
const j1 = require('Package2/package');
const j2 = require('Package2/package.json');

console.log({ p1, p2, p3, m1, m2, u1, u2, j1, j2 });

/*
Мы здесь явно не указываем откуда нужно взяться Package2, потому что в предыдущем примере мы явно указываем require('./Package1')
То когда мы пишем так 'Package2' то он попытается взяться из НодаМодульса
Мы создадим фейковые node_modules, но которые ведут себя как обычные модули из нпм

{
  p1: { hint: 'Package2: main.js' },
  p2: { hint: 'Package2: main.js' },
  p3: { hint: 'Package2: main.js' },
  m1: { hint: 'Package2: main.js' },
  m2: { hint: 'Package2: main.js' },
  u1: { add: [Function: add] },
  u2: { add: [Function: add] },
  j1: { hint: 'Package2: package.js' },
  j2: {
    name: 'module-2',
    version: '1.0.0',
    author: 'Timur Shemsedinov <timur.shemsedinov@gmail.com>',
    main: 'main.js'
  }
}

Как бы мы его не вызывали, точка входа main.js срабатывает
 */
