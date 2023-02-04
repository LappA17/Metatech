import m from 'node:module';
console.log(m);
console.log();
console.log(module);

//Тот же самый код что в и d-module.js только с require поменяли на импорт
/*
И мы получим что этот консоль лог отработает нормально console.log(m);

А этот уже выдаст RefferenceError console.log(module);
потому что индификатора module в ЭкмаСкрипт нет
*/
