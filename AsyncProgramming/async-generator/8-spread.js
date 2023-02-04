'use strict';

// выход из прошло ситуации что бы не напихивать next()
// мы сделаем синхронный генератор но из него возвращать Promise.resolve
// таким образом сам генерато сможем развернуть через Спред и передать все это дело Promise.all

function* ids(...args) {
  let i = 0;
  while (args.length > i) {
    const id = args[i++];
    if (id === undefined) return Promise.resolve(-1);
    yield Promise.resolve(id);
  }
}

const id = ids(1011, 1078, 1292, 1731, undefined, 1501, 1550);
Promise.all([...id]).then(console.log);
