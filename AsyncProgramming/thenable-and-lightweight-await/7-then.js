'use strict';

// так как это Промисы из thenable то мы можем их не только через await вызывать, а и получать из них значения или ошибку через вызова .then на Промисе
// в этом примере мы уже без ИФИ просто через then получаем значение из Промиса, те мы можем как и через await так и через then расспаковывать Промис

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

const getNext = getNumbers();
for (let i = 0; i < 5; i++) {
  getNext().then(
    (res) => console.dir({ res }),
    (err) => console.dir({ err: err.message })
  );
}
