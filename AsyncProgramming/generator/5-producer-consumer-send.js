'use strict';

function* sleep(interval) {
  const start = new Date();
  while (new Date() - start < interval) {
    yield;
  }
}

function* produce(consumer) {
  while (true) {
    yield* sleep(500);
    consumer.next(Math.random());
  }
}

function* consume() {
  let count = 0;
  let sum = 0;
  while (true) {
    const data = yield;
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

const consumer = consume();
const producer = produce(consumer);
consumer.next();

const step = () => {
  producer.next();
  setImmediate(step);
};

step();

/* Так же через секунду появляются данные

Got data: 0.07777673352061365
Count:    1
Sum:      0.07777673352061365
Average:  0.07777673352061365

Got data: 0.14250349346034108
Count:    2
Sum:      0.22028022698095473
Average:  0.11014011349047736

Got data: 0.9736484060179627
Count:    3
Sum:      1.1939286329989174
Average:  0.39797621099963915

Got data: 0.23972152191722595
Count:    4
Sum:      1.4336501549161433
Average:  0.35841253872903583
*/
