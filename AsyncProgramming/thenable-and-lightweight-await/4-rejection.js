'use strict';

// у then в полной его реализации должно быть два метода(второй метод - обрабатывает ошибку)
// здесь у нас уже пример где фция при помощи литерала объкта нам сразу объект и возвращает

const getNumbers = () => ({
  numbers: [1, 2, 3],
  then(onFulfilled, onRejected) {
    // так как мы на каждой итерации забираем первый элемент массива то из 5 иттераций - две будут с ошибкой
    // эту ошибку мы отловим в try/catch, этот catch нам словит эту ошибку
    const num = this.numbers.shift();
    if (num) {
      onFulfilled(num);
    } else {
      onRejected(new Error('I heve no numbers for you'));
    }
  },
});

// Usage

(async () => {
  // экземпляр объекта вернулся и записался в next
  // теперь у этого объекта есть состояние - массив numbers
  // и каждый раз когда мы будем использовать await - мы сможем это состояние менять
  // и здесь главное отличие от Промиса(который один раз своё состояние поменял и всё, из pemnding в резолм или реджект)
  // а наш объект мы можем писать await next и это даже не вызов функции, не await next(), а просто next и этот next - это Объект
  // и мы в цикле ниже 5 раз вызывает этот метод next
  // await вызывает метод then() передавая в него фции onFulfilled, onRejected
  const next = getNumbers();
  for (let i = 0; i < 5; i++) {
    try {
      const res = await next;
      console.dir({ res });
    } catch (err) {
      console.dir({ err: err.message });
    }
  }
})();

/*
{ res: 1 }
{ res: 2 }
{ res: 3 }
{ err: 'I heve no numbers for you' }
{ err: 'I heve no numbers for you' }
Ruslan@MacBook-Pro thenable-and-lightw
*/
