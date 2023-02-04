'use strict';

async function* ids(...args) {
  let i = 0;
  while (args.length > i) {
    const id = args[i++];
    if (id === undefined) return;
    yield id;
  }
}

// Если с обычными генератарами мы могли их развернуть с помощью Спреда, то с асинхронным так уже не получится -  [...id] !

// проблема примера ниже что нам нужно их так напихивать через next, так никто делать не будет

(async () => {
  const id = ids(1011, 1078, 1292, 1731, undefined, 1501, 1550);
  // Всё что ниже закомментирована работать не будет !
  // console.log([...id]);
  // console.log(await [...id]);
  // console.log([await ...id]);
  // console.log([...await id]);
  Promise.all([id.next(), id.next(), id.next(), id.next(), id.next(), id.next()]).then(console.log);
})();
