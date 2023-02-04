'use strict';

const fs = require('node:fs');
const { readFile } = fs;

fs.readFile = (...args) => {
	const path = args.shift();
	const callback = args.pop();
	const options = args.pop() || {};
	console.log(`Intercepted call: fs.readfile('${path}')`);
	return readFile(path, options, (err, data) => {
		if (err) console.error(err);
		else console.log(`Data received: ${data.length}`);
		callback(err, data);
	});
};

fs.readFile('./7-mixin.js', (err, data) => {
	console.log({ err, data });
});

/*
const { readFile } = fs; - мы берём ключ readFile из fs
А дальше примешиваем к fs свой readfile !!! fs.readFile = (...args) => {
Мы оборачиваем эту фцию и дальше мы можем сохраненную в индификаторе readFile, сохраннеый readfile можем отсюда вызывать, а внутри fs он уже заменён
Таким образом мы подменили, а потом откуда-то в приложение, не обязательно в этом месте этот файл может закончится, а потом в другом кто-то может сделать require('node:fs') и вызывает fs.readFile и мы просто ПЕРЕХВАЧИВАЕМ ВЫЗОВ !!!
Intercepted call: fs.readfile('./7-mixin.js')
Data received: 465
То-есть мы залогировали какой у нас файл был подгружан, его длина, буфер и тд. 

Точно так же работает и прототайп-полюшен, если из одной зависимости кто-то модифицровал наш array или другой глобальный прототип, name-space то происходит тоже самое 

Чтобы от этого защитится нужно запускать код в песочнице
ну вообще нужно следать что бы наши завимисти не делали вот такого манки-патчинга или прототайп-солюшина и не изменяли ничего в Ноде, потому что потом тяжело доказать не только безопастность, но и отловить ошибки !
*/
