'use strict';

async function* ids(...args) {
  let i = 0;
  while (args.length > i) {
    const id = args[i++];
    if (id === undefined) return;
    yield id;
  }
}

(async () => {
  const id = ids(1011, 1078, 1292, 1731, undefined, 1501, 1550);
  // then этого промиса будет вызвать с помозью for await который будет резолвить Промис
  for await (const val of id) {
    console.log({ val });
  }
})();

/*
{ val: 1011 }
{ val: 1078 }
{ val: 1292 }
{ val: 1731 }
*/
