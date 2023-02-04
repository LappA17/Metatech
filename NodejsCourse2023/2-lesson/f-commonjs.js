//Напишем свою реализацию commonjs модулей
'use strict';

const fs = require('node:fs').promises;
const vm = require('node:vm');

const RUN_OPTIONS = { timeoute: 5000, displayErrors: false };

const pseudoRequire = name => {
	console.log(`Intercepted require: ${name}`);
};

const load = async (filePath, sandBox) => {
	const src = await fs.readFile(filePath, 'utf8');
	const code = `(require, module, __filename, __dirname) => {\n${src}\n}`;
	const script = new vm.Script(code);
	const context = vm.createContext(Object.freeze({ ...sandBox }));
	const wrapper = script.runInContext(context, RUN_OPTIONS);
	const module = {};
	wrapper(pseudoRequire, module, filePath, __dirname);
	return module.exports;
};

const main = async () => {
	const sandbox = { Map: class PseudoMap {} };
	const exported = await load('./1-export.js', sandbox);
	console.log(exported);
};

main();

/*
load - будет заменителей require 
это будет асинхронная фция, которая на вход принимает (filePath, sandBox) -  имя файла и контекст который будет считаться глобальным внутри этого файла

const src = await fs.readFile(filePath, 'utf8'); - здесь мы считыаем содержимое этого файла, говорим что оно в utf8 кодировке и так как чтение файла это асинхронная фция - мы ждем пока нам промис вернет результат

const code = `(require, module, __filename, __dirname) => {\n${src}\n}`; - тут мы оборачиваем исходник, который мы считали из файла вот в такую конструкцию, мы сюда прицепляем строчку, которая очень похожа на объявления стрелочной фции и передаем туда нужные нам параметры

const script = new vm.Script(code); - дальше что у нас получилось мы передали в vm.Script и получили экземпляр Скрипта

const context = vm.createContext(Object.freeze({ ...sandBox })); - дальше мы можем исполнить этот скрипт в каком-то контексте. У нас приходит в эту функцию sandBox и дальше мы можем перепоковать этот sandBox в новый Объект чтобы не модифицировать sandBox { ...sandBox }, а дальше мы зафризили новый Объект Object.freeze() - что бы никто туда ничего не перемешивал
и дальше всё это дело передали в vm.createContext. Теперь у нас context - это новый глобал внутри которого мы будем запускать вот этот вот исходник code который мы считали из файла

const wrapper = script.runInContext(context, RUN_OPTIONS); - у нас в РАН_ОПШИНС  таймаут 5 секунд на исполнения скрипта, а дисплейЕррорс фолс, то-есть если случаться ошибки то нам их не нужно на экран выводить
Наш wrapper будет ссылкой на вот эту нашу фцию code которую мы задали в виде строки, то-есть на стрелочную фцию, которая оборачивает исходник лежащий в файле

wrapper(pseudoRequire, module, filePath, __dirname); - мы запускаем наш wrapper
первый агрумент - будет просто логировать
второй - пустой объект и к нему человек уже сможет дописывать к примеру module.export
третий - файлНейм, который у нас возвращается из аргументов
четвертый - дирнейм, что бы аргументы в этой нашей строковый стрелочной фции попали в аргументы которые у нас есть

return module.exports; - дальше мы возьмем модуль.экспорт, вернём c фции лоад и таким образом всё что человек из него наэкспортировал мы вернем из лоада

const exported = await load('./1-export.js', sandbox); - теперь мы имеем свою фцию лоад и она умеет подгружать коммонjs файлики

{
  Entity: [class Entity],
  fn: [Function: fn],
  collection: PseudoMap {}
}

const exported = await load('./1-export.js', sandbox); - мы сюда передаём sandbox что бы подменить Map, то-есть вместо фции Map там создался экземпляр класса псевдомеп. И так как поиск в глобальном контексте происходит раньше, то мы в общем если кто-то внутри этого модуля напишем new Map, то в результате вместо Мепа создаться наш класс псевдо Меп(экхемпляр его)
*/
