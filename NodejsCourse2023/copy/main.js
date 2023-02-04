'use strict';

const fsp = require('node:fs').promises;
const path = require('node:path');
const server = require('./ws.js');
const staticServer = require('./static.js');
const load = require('./load.js');
const db = require('./db.js');
const hash = require('./hash.js');
const logger = require('./logger.js');

//мы вставляем логгер в сендбокс
//важно понимать что все эти console, process, setTimeout и другие Глобальные объекты попадают в нативном JS и Ноде точно так же через sandbox !
//и были вставлены в наш код практически как внидрение зависимостей
//по-этом внутри всех наших файлов в папке api мы никаких Рекваеров не делаем !
//у нас db, console туда сразу попадает как глобальный объект без каких либо экспортов
const sandbox = {
	//то-есть мы вместо консоли добавили наш логгер
	//из-за того что оно зафриженно, наш глобальный контекст внутри наших апишек вообще не изменяемый
	console: Object.freeze(logger),
	db: Object.freeze(db),
	common: { hash },
};
const apiPath = path.join(process.cwd(), './api');
const routing = {};

(async () => {
	const files = await fsp.readdir(apiPath);
	for (const fileName of files) {
		if (!fileName.endsWith('.js')) continue;
		const filePath = path.join(apiPath, fileName);
		const serviceName = path.basename(fileName, '.js');
		routing[serviceName] = await load(filePath, sandbox);
	}

	staticServer('./static', 8000);
	server(routing, 8001);
})();
