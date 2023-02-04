'use strict';

const http = require('node:http');

// Попрбуем реализовать fetch на стороне Сервера, потому что в браузере он есть, но в Ноде нет

const fetch = url =>
	new Promise((resolve, reject) => {
		http.get(url, res => {
			const code = res.statusCode;
			if (code !== 200) {
				return reject(new Error(`Http status code: ${code}`));
			}

			res.on('error', reject);

			const chunks = []; // это будет массив чанков(кусочкев) которые нам по-тихоньку приходят
			res.on('data', chunk => {
				chunks.push(chunk);
			});

			res.on('end', () => {
				const json = Buffer.concat(chunks).toString(); //склеим все Чанки в один
				try {
					const object = JSON.parse(json); // парсим json
					resolve(object);
				} catch (error) {
					reject(error);
				}
			});
		});
	});

module.exports(fetch);

/* У http.get есть коллбек куда мы передали res, этот коллбека контракт НЕ совместим с коллбек ласт енд фёрст, а тут первым аргументом приходит res внутри которого есть socket потому что этот res - это объект(http result)

    Дальше нам нужно потихонька забираь страничку, потому что она огромная и она будет по кусочкам приходить, по-этому так как эта страничка может за один раз не прийти мы сразу хотим подписать наш reject на ошибки res.on('error', reject);
*/
