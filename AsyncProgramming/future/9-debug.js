'use strict';

let i = 0;

class Future {
  constructor(executor) {
    this.id = i++;
    console.log(`new Future ${this.id}`);
    this.executor = executor;
  }

  static of(value) {
    return new Future((resolve) => resolve(value));
  }

  chain(fn) {
    console.log(`chain ${this.id}`);
    return new Future((resolve, reject) =>
      this.fork(
        (value) => {
          console.log(`resolve ${this.id}`);
          fn(value).fork(resolve, reject);
        },
        (error) => reject(error)
      )
    );
  }

  map(fn) {
    console.log(`map ${this.id}`);
    return this.chain((value) => {
      console.log(`map.chain ${this.id}`);
      return Future.of(fn(value));
    });
  }

  fork(successed, failed) {
    console.log(`fork ${this.id}`);
    this.executor(successed, failed);
  }
}

// Usage

Future.of(5)
  .map((x) => ++x)
  .map((x) => x ** 3)
  .map((x) => x * 2)
  .fork((value) => console.log(`Result ${value}`));

/*
new Future 0
map 0
chain 0
new Future 1
map 1
chain 1
new Future 2
map 2
chain 2
new Future 3
fork 3
fork 2
fork 1
fork 0
resolve 0
map.chain 0
new Future 4
fork 4
resolve 1
map.chain 1
new Future 5
fork 5
resolve 2
map.chain 2
new Future 6
fork 6
Result 432
*/
