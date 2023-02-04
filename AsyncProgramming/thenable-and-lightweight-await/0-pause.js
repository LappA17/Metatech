'use strict';

// thenable это объект у которого есть метод then и на базе этого контракта(объект с методом then имеет свое определенное поведение - это контракт, на основе которого можно разработать или Промис или своместимую с Промисом контрукцию, которая будет уметь работать с async/await)

const PAUSE = 1000;

// Важно понимать что этот метод then имеет зарезервирванное слово !!!
// если я поменяю название метода на then1 или любое другое слово то await thenable не будет работать !!!

const thenable = {
  then(onFulfilled) {
    setTimeout(onFulfilled, PAUSE);
  },
};

(async () => {
  await thenable;
  console.log('---uno---');
  await thenable;
  console.log('---due---');
  await thenable;
  console.log('---tre---');
  await thenable;
})();

/*
С секундной задержки uno, due, tre будут выводится в консоль
---uno---
---due---
---tre---

*/
