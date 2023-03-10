'use strict';

// Emulate Asynchronous calls

const pause = () => new Promise(resolve => setTimeout(resolve, Math.floor(Math.random() * 1000)));

// Asynchronous functions

const readConfig = async name => {
	await pause();
	console.log('(1) config loaded');
	return { name };
};

const doQuery = async statement => {
	await pause();
	console.log('(2) SQL query executed: ' + statement);
	return [{ name: 'Kiev' }, { name: 'Roma' }];
};

const httpGet = async url => {
	await pause();
	console.log('(3) Page retrieved: ' + url);
	return '<html>Some archaic web here</html>';
};

const readFile = async path => {
	await pause();
	console.log('(4) Readme file loaded: ' + path);
	return 'file content';
};

// Usage

(async () => {
	const config = await readConfig('myConfig');
	const res = await doQuery('select * from cities');
	const json = await httpGet('http://kpi.ua');
	const file = await readFile('README.md');
	console.log('Done');
	console.dir({ config, res, json, file });
})();

/* usage with callback
readConfig('myConfig', () => {
	doQuery('select * from cities', () => {
		httpGet('http://kpi.ua', () => {
			readFile('README.md', () => {
				console.log('DONE');
			});
		});
	});
});
*/

/*
    Здесь у нас будет имитация реального кода, нам нужно сначало считать Конфиг, запрос к бд, потом какой-то там запрос в хттп потом к файлу и нам это всё нужно сделать последовательно !
    Если бы мы всё это писали на callback то росла бы цепочка вложенностей
*/
