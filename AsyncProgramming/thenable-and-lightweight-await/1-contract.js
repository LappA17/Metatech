'use strict';

// фция thenableFactory возвращает Объект с методом then куда приходит onFulfilled
// onFulfilled - это фция коллбек, куда мы возвращаем какое-то значение

const thenableFactory = () => ({
  then(onFulfilled) {
    onFulfilled(5);
  },
});

// Usage

(async () => {
  const res = await thenableFactory(); // нам сюда синхронно вернётся 5ка, что бы такой thenableFactory вызвать нужно это делать в ИФИ
  console.dir({ res });
})();

// { res: 5 }
