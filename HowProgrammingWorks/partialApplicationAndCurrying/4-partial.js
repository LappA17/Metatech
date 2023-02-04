'use strict';

// Здесь мы делаем фцию Парсер, которая поможет нам избавится от некрасивого null в bind и сделать код красивее
// Фция partial будет частично применять аргументы к другим фциям(js позволяет передавать одни фции в другие и возращать фции в качестве результата) и мы этим воспользуемся передавая в фцию partial фцию fn, а так же передадим значение которое мы хотим закрепить как первый аргумент этого fn - это x. Дальше у этой фции передасться еще большое количество аргументов и когда мы её второй раз вызовим, то вызовится фция fn() и первым аргументмо пойдет x который мы в партиал передали, а все остальные аргументы развернутся из аргс

const partial =
  (fn, x) =>
  (...args) =>
    fn(x, ...args);

// Usage

const sum4 = (a, b, c, d) => a + b + c + d; // мы заготовили фцию из 4 аргумнетов, которые просто их все складывает

const f11 = partial(sum4, 1); // 1 отправится на место аргумента a в фции sum4. После этого у нас остается фция уже с 3 аргументами а не 4, которая запишется в переменную f11. То-есть мы фцию sum4 передали на место fn в partial и один аргумент закрепили поместив на место x наш 1
const f12 = partial(f11, 2); // дальше мы к этой фции f11 применяем partial и отправляем туда второй аргумент, который попадает на место b
const f13 = partial(f12, 3); // тоже самое с 3 аргументов
const y1 = f13(4); // та как это послдений арумент d то мы можем f13 уже вызывать
console.log(y1); // 10 в консоль

const f21 = partial(sum4, 1, 2); // мы передаём 1 и 2, но 2 теряется, потому что Х только один аругмент может принимать !
const f22 = partial(f21, 3);
const y2 = f22(4); // после того как мы передали 1, 2, 3 то во внуттрь частичного применения попали только 1 и 3, то вернулась опять фция, которая не может ничего посчитать
console.log(y2); // NaN

// То что мы делали раньше при помощи двойной вложенности лямбд или одна лямбда в const log а друга в lg как во твором примере и мы двойную вложенность лямбд просто взяли и абстрагировали от конкретного случая(от логорифмоф, мы выбросили логорифмы на ружу и мы уже не знаем какуе именно фцию мы частично применяем и передаём туда, те мы можем как и логорифмы так и фцию sum4 передать !), теперь наша фция абстрагированна от конкретного случая !
