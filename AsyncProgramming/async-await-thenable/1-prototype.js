'use strict';

console.log(Function);

const AsyncFunction = (async () => {}).constructor;
console.log(AsyncFunction);

const fn = () => {}; //так объявляем обычную фцию
const afn = async () => {}; //так асинхронную

console.dir({
	fn: typeof fn, //вернёт [Function: Function]
	afn: typeof afn, //тоже вернёт [Function: AsyncFunction]
});

console.log(fn instanceof Function); //будет true
console.log(afn instanceof Function); //тоже будет true
console.log(fn instanceof AsyncFunction); //будет false
console.log(afn instanceof AsyncFunction); //будет true

// process.exit(0); - код после process.exit(0); не пойдет

// здесь мы посмотрим как function и async function связаны друг с другом

console.log(afn.__proto__.constructor); // [Function: AsyncFunction]
console.log(afn.__proto__.__proto__.constructor); // [Function: Function]
console.log(afn.__proto__.__proto__.__proto__.constructor); // [Function: Object]

console.log();

// ниже даст тоже самое что и выше

console.log(Object.getPrototypeOf(afn).constructor); // [Function: AsyncFunction]
console.log(Object.getPrototypeOf(Object.getPrototypeOf(afn)).constructor); // [Function: Function]
console.log(Object.getPrototypeOf(Object.getPrototypeOf(Object.getPrototypeOf(afn))).constructor); // [Function: Object]

/*
    У нас от прототипа Function наследуются все возможные виды определения функций, те у нас все функции были типа Function
    Теперь же появился AsyncFunction, только в виде прототипа мы его в глобальным контексте не видим, мы можем его оттуда выкулолупать если объявим вот такую
    асинхроную лямбду (async () => {}) и возьмем от неё constructor
    Благодаря AsyncFunction мы сможем установить что те объекты которые в нее пришли синхронные или асинхронные

    afn.__proto__.constructor - если мы таким способом возьмём контруктор из асинхронноб фции - то это будет асинхронная фция
    afn.__proto__.__proto__.constructor - здесь оно уже будет ссылаться на функцию
    afn.__proto__.__proto__.__proto__.constructor - будет ссылаться на Object
    afn.__proto__.__proto__.__proto__.__proto__.constructor - будет ссылаться на null

    console.log(Object.getPrototypeOf(afn).constructor); - тоже самое мы можем переписать с getPrototypeOf. Только этот способ по приличней будет для получение прототипов а не писать __proto__
*/
