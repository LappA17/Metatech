const promise = import('node:events');
console.log({ promise });

//здесь мы просто резолвим промис
promise.then(events => {
	console.log({ defaultMaxListeners: events.defaultMaxListeners });
});

//здесь же он зазрезолвиться(расспакуется) сразу и мы будем иметь доступ к библиотеке сразу в корни этого файла
const events = await import('node:events');
console.log({ defaultMaxListeners: events.defaultMaxListeners });

/*
Динамический импорт

{ promise: Promise { <pending> } }
{ defaultMaxListeners: 10 }
{ defaultMaxListeners: 10 }
*/
