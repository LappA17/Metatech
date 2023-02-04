'use strict';

// Здесь мы решим проблему из предыдущего примера 5-promise

// Мы уже делаем return лямбды которая возвращает Промис, а не сам Промис

const getNumbers = () => {
  const numbers = [1, 2, 3];
  return () =>
    new Promise((resolve, reject) => {
      const num = numbers.shift();
      if (num) {
        resolve(num);
      } else {
        reject(new Error('I have no numbers for you'));
      }
    });
};

// Usage

// мы вызываем getNumbers(); перед циклом в ифи и мы запишем ссылку на фцию в переменную getNext
// и теперь каждый раз когда мы будем вызывать await то мы будем не просто await getNext делать, а await getNext()
// и каждый раз этот getNext() будет возвращать новый Промис, потому что один Промис уже разрешился и нам нужно на каждой итерации генерить новый Промис, а это мы можем делать только
// при помощи функции(в getNumbers мы делает не return промис, а return () =>)

/* Комментарий из чата:
У тебя из функции getNumbers возвращается анонимная функция и присваивается идентификатору getNext.
Каждый вызов getNext вытаскивает из замыкания по одному элементу массив и создаёт промис, который её возвращает
*/

(async () => {
  const getNext = getNumbers();
  for (let i = 0; i < 5; i++) {
    try {
      const res = await getNext();
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
{ err: 'I have no numbers for you' }
{ err: 'I have no numbers for you' }
*/
