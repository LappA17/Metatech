'use strict';

function* sleep(interval) {
  const start = new Date();
  while (new Date() - start < interval) {
    yield;
  }
}

function* produce() {
  yield* sleep(500);
  return Math.random();
}

function* consume() {
  let count = 0;
  let sum = 0;
  while (true) {
    const data = yield* produce();
    count++;
    sum += data;
    console.log(
      `Got data: ${data}\n` +
        `Count:    ${count}\n` +
        `Sum:      ${sum}\n` +
        `Average:  ${sum / count}\n`
    );
  }
}

function* anotherTask() {
  while (true) {
    yield* sleep(1000);
    console.log('Hello!\n');
  }
}

const consumer = consume();
const task = anotherTask();

const step = () => {
  consumer.next();
  task.next();
  setImmediate(step);
};

step();

/*  Каждую секунду будут выводится данные

Got data: 0.29392591244146615
Count:    1
Sum:      0.29392591244146615
Average:  0.29392591244146615

Hello!

Got data: 0.6665750291980246
Count:    2
Sum:      0.9605009416394907
Average:  0.48025047081974537

Got data: 0.8847773089558426
Count:    3
Sum:      1.8452782505953333
Average:  0.6150927501984444

Hello!

Got data: 0.8531665291181283
Count:    4
Sum:      2.6984447797134616
Average:  0.6746111949283654

Got data: 0.8378227867984458
Count:    5
Sum:      3.536267566511907
Average:  0.7072535133023814

Hello!

Got data: 0.3576703479099905
Count:    6
Sum:      3.8939379144218975
Average:  0.6489896524036496
*/
