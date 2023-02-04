'use strict';

const fs = require('node:fs').promises;
const vm = require('node:vm');

const RUN_OPTIONS = { timeout: 5000, displayErrors: false };

const load = async (filePath, sandbox) => {
	const src = await fs.readFile(filePath, 'utf8'); //загружаем исходник модулей из файла
	const code = `'use strict';\n${src}`; //доклееваем к нему юзстрикт, перенос строки + сам исходник
	const script = new vm.Script(code); //передаём исходник в vm.Script
	const context = vm.createContext(Object.freeze({ ...sandbox })); //сделали контекст
	const exports = script.runInContext(context, RUN_OPTIONS); //ранИнКонтекст
	return exports;
};

const main = async () => {
	const sandbox = { Map: class PseudoMap {} };
	const exported = await load('./h-example.mm', sandbox);
	console.log(exported);
};

main();

/*
    Здесь мы реализуем систему модульности как в Метархии, на примере файла с++ расширением

    Res: { doSomething: [Function: doSomething] }
*/

/*
Кроме системы модульности мы посмотрим как в Ноде работают package - это целый каталог с файлом package.json, в котором описанно что лежит в этом каталоге */
