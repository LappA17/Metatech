'use strict';

const fs = require('node:fs');
const util = require('node:util');
const path = require('node:path');

//здесь мы заготоавливаем эксейп последовательности для разных цветов
//что бы выводить красным, желтым, зеленым и тд
const COLORS = {
	info: '\x1b[1;37m',
	debug: '\x1b[1;33m',
	error: '\x1b[0;31m',
	system: '\x1b[1;34m',
	access: '\x1b[1;38m',
};

const DATETIME_LENGTH = 19;

//Благодаря этому Логгеру если мы где-то в проекте, к примеру в api/user напишем console.log - то отработает именно этот наш Логгер !
class Logger {
	//В классе Логгер мы будем делать файловый поток fs.createWriteStream
	constructor(logPath) {
		this.path = logPath;
		const date = new Date().toISOString().substring(0, 10);
		const filePath = path.join(logPath, `${date}.log`);
		//мы сюда передаём имя файлов в которых мы хотим писать
		//и опшинами передаём разные нужные нам флаги
		//флаг а - это append, то-есть мы хотим в этот файловый поток только добавлять !
		//это значит что мы можем в этот файл что угодно писать и оно будет писаться именно в файл
		this.stream = fs.createWriteStream(filePath, { flags: 'a' });
		//при помощи этой регулярки мы будем оптимизировать стектрейс оптимизировать
		this.regexp = new RegExp(path.dirname(this.path), 'g');
	}
	//метод close закрывает файловый поток
	close() {
		return new Promise(resolve => this.stream.end(resolve));
	}
	//сюда мы первым аргументов передаём тип логирования
	//вторым аргументов какую строчку мы туда пишем
	write(type = 'info', s) {
		//нам нужно дата что бы записать ее в лог
		const now = new Date().toISOString();
		const date = now.substring(0, DATETIME_LENGTH);
		const color = COLORS[type];
		const line = date + '\t' + s;
		//мы на экран будем показывать всё разными цветами
		console.log(color + line + '\x1b[0m');
		//здесь мы приобразуем, что бы одна строчка файла соответствовала одной записи в лог
		//нам это нужно к примеру для логирования ошибки, потому что ошибка такая многострочная, там стектрейс выводится
		//а здесь мы сделаем так что бы в файле все это выводилось в одну строку
		const out = line.replace(/[\n\r]\s*/g, '; ') + '\n';
		//здесь еще и копию файл пишем
		this.stream.write(out);
	}

	log(...args) {
		const msg = util.format(...args);
		this.write('info', msg);
	}

	dir(...args) {
		const msg = util.inspect(...args);
		this.write('info', msg);
	}

	debug(...args) {
		const msg = util.format(...args);
		this.write('debug', msg);
	}

	error(...args) {
		const msg = util.format(...args).replace(/[\n\r]{2,}/g, '\n');
		this.write('error', msg.replace(this.regexp, ''));
	}

	system(...args) {
		const msg = util.format(...args);
		this.write('system', msg);
	}

	access(...args) {
		const msg = util.format(...args);
		this.write('access', msg);
	}
}

module.exports = new Logger('./log');
