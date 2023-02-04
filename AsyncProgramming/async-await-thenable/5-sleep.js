'use strict';

const sleep = msec =>
	new Promise(resolve => {
		setTimeout(resolve, msec); //мы первым аргументов передаём фцию(вместо коллбека) и она с undefined резолвлится, а вторым вреся исполнение таймаута
	});

(async () => {
	console.log('Start sleep: ' + new Date().toISOString());
	console.log('  Sleep about 3 sec');
	await sleep(3000);
	console.log('After sleep: ' + new Date().toISOString());
})();

/* Вместо того что бы ставить setTimeout и после него что выполнять мы можем просто написать await и код будет дожидаться
    то-есть console.log('After sleep: ' + new Date().toISOString()); не выполнится сразу а будет ждать 3 секунды
    Но самое важное что все эти 3 секунды event loop будет свободным и сможет обрабатывать всякие разные события, то-есть эта функция не блокирует цикл событий

    Но сама фция sleep хоть мы ее и вызываем с await и она возвращет Промис, но она объявлена без ключевого слова async. Потому что мы setTimeout не можем обернуть в async и нам для этого нужня была бы лямбда которая возвращает не резолвленный промис
*/
