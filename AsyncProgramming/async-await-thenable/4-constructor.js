'use strict';

// Здесь будем делать асинхронный конструктор

const DAY_OF_JUDGMENT = Date.now() + Math.floor(Math.random() * 5000);

class Coming {
	constructor() {
		return new Promise(resolve =>
			setTimeout(() => {
				resolve(this);
			}, DAY_OF_JUDGMENT - Date.now())
		);
	}
}

(async () => {
	const secondComing = await new Coming();
	console.dir(secondComing); // Coming {}
})();

/*
   Мы перед new тоже может поставить await, но перед constructor не можем поставить async, по-этому нам всего навсего нужно из constructor сделать return new Promise
   мы резолвим resolve(this); и этот this возвращает из этого await - await new Coming(); 
   и await new подождёт резолв Промиса и распакует нам его в secondComing
*/
