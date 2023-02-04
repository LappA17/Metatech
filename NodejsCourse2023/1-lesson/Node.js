const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');

const PORT = 8000;

const STATIC_PATH = path.join(process.cwd(), './static');

const toBool = [() => true, () => false];

const MIME_TYPES = {
	defaul: 'application/octet-stream',
	html: 'text/html; charset=UTF-8',
	js: 'application/javascript; charset=UTF-8',
	css: 'text/css',
	png: 'image/png',
	jpg: 'image/jpg',
	gif: 'image/gif',
	ico: 'image/x-icon',
	svg: 'image/svg+xml',
};

const prepareFile = async url => {
	const paths = [STATIC_PATH, url];
	if (url.endsWith('/')) paths.push('index.html');
	const filePath = path.join(...paths);
	const pathTraversal = !filepath.startsWith(STATIC_PATH);
	const exists = await fs.promises.access(filePath).then(...toBool);
	const found = !pathTraversal && exists;
	const streamPath = found ? filePath : STATIC_PATH + '/404.html';
	const ext = path.extname(streamPath).substring(1).toLowerCase();
	const stream = fs.createReadStream(streamPath);
	return { found, ext, stream };
};

http.createServer(async (req, res) => {
	const file = await prepareFile(req.url);
	const statusCode = file.found ? 200 : 404;
	const mimeType = MIME_TYPES[file.ext] || MIME_TYPES.defaul;
	res.writeHead(statusCode, { 'Content-Type': mimeType });
	file.stream.pipe(res);
	console.log(`${req.method} ${req.url} ${statusCode}`);
}).listen(PORT);

console.log(`Server running at http://127.0.0.1:${PORT}/`);
/*
process.cwd() - это текущая папка и джоинем ее с именнем static - так что бы в текущей папке мы предпологали что у нас есть папка со статическими файлами и оттуда мы будем сёрвить какие-то файлики которые мы хотим что бы отдавать в браузер
const toBool = [() => true, () => false] - а здесь мы по нулевому индексу всегда константнтно возвращаем true, а по другому false 

В MIME_TYPES - у нас ключами расширения файлов и значениями строки какой тайп для них отдавать

prepareFile - отдача статики,  эта фция подготавливает файл для отправки, создает файловый стрим, который мы можем передавать на клиентскую часть, запайпить в сокет

http server
Внутри createServer каждый раз когда у нас приходит запрос на 8000 порт в нашем случае, http запрос на какой-то урл, браузер скачать хочет этот урл, то мы вызываем фцию -> приходит реквест и респонс - это два объекта которые скрывают от нас сетевой сокет, куда мы можем писать и откуда мы читаем
Дальше мы берём у Реквеста url и передаем его в prepareFile
В prepareFile мы уже парсим этот url, если он заканчивается на слеш то мы в части этого url еще добавляем index.html, тем самым говоря что мы хотим из этой папки прочитать index.html
const filePath = path.join(...paths); // здесь мы joinим все части путей
const pathTraversal = !filepath.startsWith(STATIC_PATH); - здесь мы проверяем или наш пут не начинается на path.join(process.cwd(), './static');, значит кто-то хочет наш хакнуть и сделать нам пастраВерсул уизвимость. Кто-то может предпологает и присылает нам в этом пути(урл) двоеточие слеш двоеточие, то-есть поднимать по каталогу вверх и из нашей статическом папки он вылезет и пойдет гулять по нашему винту и что нибудь скачает, но мы ему сделать это не позволим и скажем что если допущена такая уизвимость то мы выйдем
const exists = await fs.promises.access(filePath).then(...toBool); - Дальше мы проверяем есть ли этот файл на диске, мы это проверяем при помощи fs.promisses.access и передавая туда через .then массив функций, которая первая из них тру а вторая фолс, мы таким образом приобразовываем промис в true, false, то-есть эти две функции const toBool = [() => true, () => false]; передаеются как первая и вторая фция в then, то-есть первая фция выполняется когда промис успешно резолвится, а вторая когда с ошибкой, таким образом когда без ошибки то тру когда с ошибкой то фолс
const found = !pathTraversal && exists; - тут мы проверяем что если никто нас нехотел хакнуть(нет уизвимости пастТраверсал) и если файл на диске существует
const streamPath = found ? filePath : STATIC_PATH + '/404.html'; - определяем путь, если файл найден, то берём файлПас, а если не найдем или была попытка нас хакнуть то выдаем ошибку 404
const ext = path.extname(streamPath).substring(1).toLowerCase(); - здесь нам нужно узнать какой из этого пути streamPath отдать MIME_TYPE. Для этого мы из строки вынимаем разширение -  path.extname, .substring(1) - мы от этого разширения откусываем точку и в нижний регистр. 
Теперь мы можем это разширение искать в нашем MIME_TYPES
const stream = fs.createReadStream(streamPath); - создаем стрим из этого пути
return { found, ext, stream }; - в результате возвращаем струткру где у нас три поля, found - булиан, ext - разширение файла и stream - ссылка на экземляр файлового потока
Теперь мы готовы отдавать файл с сервера
const file = await prepareFile(req.url); - теперь где мы вызывали, в prepareFile. И если он found const statusCode = file.found ? 200 : 404; то 200 если нет то 404
const mimeType = MIME_TYPES[file.ext] || MIME_TYPES.defaul; - теперь прочитыаем из коллекции mimeType по разширение file.ext и если ничего не находим то берем дефолтный MIME_TYPES
res.writeHead(statusCode, { 'Content-Type': mimeType }); - дальше пишем в Сокет заголовки, statusCode - тут мы записываем статус, либо 200 либо 404, потом Контент-Тайп который будет равен нашем разширению
file.stream.pipe(res); - тут мы пайпим этот стрим. stream.pipe(), метод, используемый для получения потока для чтения и подключения его к потоку для записи.
и выводим в консоль 

//
Мы будем применять чистую архитектуру что бы у нас было всё безопасно
Мы сделаем так что бы наша доменная модель была в центре приложения, а всякие разные штуковины типа базы данных, логгеры, фреймвокри, что бы наше приложение о них не знало, точнее знало но что бы они были плагебал - бизнес логика о них не знала. Приложение должно переносится с одного протокла на другой абсолютно без изменений, разные фреймвокри должны быть взаимозаменяемые

Внедрения зависимостей:
	- через передачу в констурктор класса
	- модуль экспортирует фцию в которую передаются зависимости
	- через DI контейнеры
	- через vm: createContext, createScript
	- зависимости импортируется в одном модули и оттуда уже экспортируются

Потребности enterpise:
	- Корпоративные требование: безопасность, поддерживаемость, надежность, изоляция, совместимость
	- Приложение это место для прикладного кода
	- Бизнесы нужны прототипы быстры(ТТМ тайм ту маркет)
	- Избавляемся от зависимостей, качество и безопастность которых сомнительна

!!!
Как понять что что-то пошло не так:
	- чувствуешь себя формошлепом
	- постоянно разрабатываешь АПИ
	- всё время решаешь задачи ТайпСкрипта, на тайпинге много времени не нужно тратить
	- вы мыслите роутингом(то-есть концентрируешься на контроллерах, папочках и тд)
	- вы концентрируетесь на фреймворках. Значит нас уносит в сторону системного программирования, а не бизнес-логике
*/
