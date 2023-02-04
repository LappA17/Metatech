'use strict';

//function declaration
function inc(a) {
	return a + 1;
}

//function expression - анонимна фция присваивается в переменную
const sum = function (a, b) {
	return a + b;
};

//лямбда expression
const max = (a, b) => (a > b ? a : b);

//лямбда в которой справа от стрелки не expression а блок кода в в фигурных скобках {}
const avg = (a, b) => {
	const s = sum(a, b);
	return s / 2;
};
//Тем самым мы на считали 4 способа объявлений фукнции

//Объявления функции у Объекта
const obj = {
	name: 'Marcus Aurelius',
	split(sep = ' ') {
		return this.name.split(sep);
	},
};

class Person {
	//объявления конструктора
	constructor(name) {
		this.name = name;
	}
	//объявления статического метода у Класса
	static of(name) {
		return new Person(name);
	}
	//и объявление обычного метода у класса
	split(sep = ' ') {
		return this.name.split(sep);
	}
}

const person = Person.of('Marcus Aurelius');

console.log('inc(5) =', inc(5));
console.log('sum(1, 3) =', sum(1, 3));
console.log('max(8, 6) =', max(8, 6));
console.log('avg(8, 6) =', avg(8, 6));
console.log('obj.split() =', obj.split());
console.log('person.split() =', person.split());

/*
    В этом файле мы посмотрим какие у нас были сопсобы объявлений обычных функций
*/
