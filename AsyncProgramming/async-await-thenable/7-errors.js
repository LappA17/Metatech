'use strict';

const fs = require('node:fs');
const { readFile } = fs.promises;

(async () => {
	try {
		const file1 = await readFile('1-prototype.js'); //будет без ошибки
		//тут уже будет ошибка потому что нет .js
		//мы в catch подписываемся на ошибку в Промисе !
		const file2 = await readFile('2-sync').catch(err => {
			console.log('Promise...catch');
			console.error(err);
			//после этого из кетча мы можем вызвать readFile но уже с правильным названием
			//и этот readFile вернёт Промис и этот Промис будет дожидаться вот этим вот awaitом - file2 = await readFile
			//и самое главное что у нас в file2 вернётся нормальный файл, даже не смотря на ошибку, потому что мы её обработали
			return readFile('2-sync.js');
		});
		const file3 = await readFile('3-async');
		console.dir([file1.length, file2.length, file3.length]);
	} catch (err) {
		console.log('try...catch');
		console.error(err);
	}
})();

/*
    Promise...catch
    [Error: ENOENT: no such file or directory, open '2-sync'] {
    errno: -2,
    code: 'ENOENT',
    syscall: 'open',
    path: '2-sync'
    }
    try...catch
    [Error: ENOENT: no such file or directory, open '3-async'] {
    errno: -2,
    code: 'ENOENT',
    syscall: 'open',
    path: '3-async'
    }

    Так как у нас есть .catch который в file2 - то-есть отлавливатель ошибок Промисов, но если мы бы убрали этот catch или в file3 сделали бы ошибку(уберем .js и оставим readFile('3-async')) то у нас же нет здесь обработчика catch и эта ошибка словитс в try и всё что было написано в императивном стиле - ловится try, а все что обработано в стиле Промисов(те тот catch в file2) то до try дело не дойдёт !
*/
