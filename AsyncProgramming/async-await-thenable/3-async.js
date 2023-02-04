'use strict';

// здесь мы перевели все синхронные функции с 2-sync на асинхронные

async function inc(a) {
	return a + 1;
}

const sum = async function (a, b) {
	return a + b;
};

const max = async (a, b) => (a > b ? a : b);

const avg = async (a, b) => {
	const s = await sum(a, b);
	return s / 2;
};

const obj = {
	name: 'Marcus Aurelius',
	async split(sep = ' ') {
		return this.name.split(sep);
	},
};

class Person {
	constructor(name) {
		this.name = name;
	}

	static async of(name) {
		return await new Person(name);
	}

	async split(sep = ' ') {
		return this.name.split(sep);
	}
}

const person = new Person('Marcus Aurelius');

(async () => {
	console.log('await inc(5) =', await inc(5));
	console.log('await sum(1, 3) =', await sum(1, 3));
	console.log('await max(8, 6) =', await max(8, 6));
	console.log('await avg(8, 6) =', await avg(8, 6));
	console.log('await obj.split() =', await obj.split());
	console.log('await person.split() =', await person.split());
})();

/*
    Везде где стоит слово async перед фцию - результатом будет Промис

    Для того что бы вызывать все эти асинхронные функции то нам нужен блок обёрнутый в асинхронную фцию, то-есть без (async () => {})() у нас при вызове фции будет ошибка
    А если оставить (async () => {})() и запустить без await то у нас будет Promise { 6 } к примеру из первой фции, те у нас будет зарезолвленный Промис
    'await avg(8, 6) =', await avg(8, 6)) но эта строка вернула нам Promise pending если запустить без await, потому что сама фция уже обёрнута в async await, то-есть внутри этой функции тоже есть await и когда мы вызываем эту фцию она на этом await и остановилась вот здесь const s = await, то-есть она не пошла дальше и не смогла сделать return
*/
