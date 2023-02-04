import { createRequire } from 'node:module';
console.log({ 'import.meeta': import.meta });

const require = createRequire(import.meta.url); //так мы создаем новый специфический рекваер

const fs = require('node:fs');
console.log(Object.keys(fs));

console.log(require);

/*
Тут посмотрим как мы можем из модулей Экма-Скрипт получить себе функцию require, потому что ее как бы нету
Точно так же как в commonjs у нас есть этот Рекваер в глобальном контексте, мы можем обратится к нему как к функции, а если мы перенес код в экма-скрипт модули то там не будет реквает и как же нам его получить

import.meta.url - у нас у импорта пристёгнутые методанные и мы из них можем что нибудь считать, в данном случае мы считаем путь к текущему файлу и создадим, потому что createRequire требует путь к текущему файлу. С помощью этой фции мы можем рекваерить веб-сокеты которые мы сюда установили, встроенную fs и это тоже работает


'import.meeta': [Object: null prototype] { - вот здесь мы вывели все методанные которые находятся в import.meta, там только ключ url есть
    
{
  'import.meeta': [Object: null prototype] {
    url: 'file:///Users/Ruslan/Desktop/Work/timur-shemsedinov-nodejs/2-lesson/c-require.mjs'
  }
}
[
  'appendFile',        'appendFileSync',   'access',
  'accessSync',        'chown',            'chownSync',
  'chmod',             'chmodSync',        'close',
  'closeSync',         'copyFile',         'copyFileSync',
  'cp',                'cpSync',           'createReadStream',
  'createWriteStream', 'exists',           'existsSync',
  'fchown',            'fchownSync',       'fchmod',
  'fchmodSync',        'fdatasync',        'fdatasyncSync',
  'fstat',             'fstatSync',        'fsync',
  'fsyncSync',         'ftruncate',        'ftruncateSync',
  'futimes',           'futimesSync',      'lchown',
  'lchownSync',        'lchmod',           'lchmodSync',
  'link',              'linkSync',         'lstat',
  'lstatSync',         'lutimes',          'lutimesSync',
  'mkdir',             'mkdirSync',        'mkdtemp',
  'mkdtempSync',       'open',             'openSync',
  'opendir',           'opendirSync',      'readdir',
  'readdirSync',       'read',             'readSync',
  'readv',             'readvSync',        'readFile',
  'readFileSync',      'readlink',         'readlinkSync',
  'realpath',          'realpathSync',     'rename',
  'renameSync',        'rm',               'rmSync',
  'rmdir',             'rmdirSync',        'stat',
  'statSync',          'symlink',          'symlinkSync',
  'truncate',          'truncateSync',     'unwatchFile',
  'unlink',            'unlinkSync',       'utimes',
  'utimesSync',        'watch',            'watchFile',
  'writeFile',         'writeFileSync',    'write',
  'writeSync',         'writev',           'writevSync',
  'Dir',               'Dirent',           'Stats',
  'ReadStream',        'WriteStream',      'FileReadStream',
  'FileWriteStream',   '_toUnixTimestamp', 'F_OK',
  'R_OK',              'W_OK',             'X_OK',
  'constants',
  ... 1 more item
]
[Function: require] {
  resolve: [Function: resolve] { paths: [Function: paths] },
  main: undefined,
  extensions: [Object: null prototype] {
    '.js': [Function (anonymous)],
    '.json': [Function (anonymous)],
    '.node': [Function (anonymous)]
  },
  cache: [Object: null prototype] {}
}
*/
