'use strict';

class Future {
  constructor(executor) {
    this.executor = executor;
  }

  static of(value) {
    return new Future((resolve) => resolve(value));
  }

  chain(fn) {
    return new Future((resolve, reject) =>
      this.fork(
        (value) => fn(value).fork(resolve, reject),
        (error) => reject(error)
      )
    );
  }

  map(fn) {
    return this.chain((value) => Future.of(fn(value)));
  }

  fork(successed, failed) {
    this.executor(successed, failed);
  }
}

// Usage

// Тут мы разобьем вызов Фьючера в нескольких индефикаторов
// Обрати внимание что f4 цепляет не на f3, а на f1

const f1 = Future.of(6);
const f2 = f1.map((x) => ++x);
const f3 = f2.map((x) => x ** 3);
const f4 = f1.map((x) => x * 2);

// мы каждый из фьючеров исполним по 2 раза

f1.fork((x) => console.log('f1 fork1', x));
f1.fork((x) => console.log('f1 fork2', x));
f2.fork((x) => console.log('f2 fork1', x));
f2.fork((x) => console.log('f2 fork2', x));
f3.fork((x) => console.log('f3 fork1', x));
f3.fork((x) => console.log('f3 fork2', x));
f4.fork((x) => console.log('f4 fork1', x));
f4.fork((x) => console.log('f4 fork2', x));

console.log('\nChange initial value of chain:');
{
  // Мы будем один и тот же фьючер f1 вызывать несколько раз, при этом ссылка на сам фьючер ф1 остается и он не зарезолвился, потому что зарезолвилась только фция коллбек переданная в него (x) => console.log('fork1', x), но ф1 в некакое состояние не перешёл, ф1 как был чистиньким(НЕрезолв) так и остался
  // Потом мы хотим вычилсить тоже самое от тройки, он еще раз нам вычислит (x) => console.log('fork2', x) и второй форк нам вернёт ту же самую цепочку вычеслений но уже произведеную от тройки. И потом всё тоже самое только от 4ки и 5ки. То-есть мы один и тот же Фьючер используем для вычесленний несколько раз
  // Каким образом это получается ? У нас есть объект source, а const source это фция которая принимает коллбек и туда возвращает значение source.value, а ниже мы этот source.value задаём в 2. То-есть у нас это консткрукция из которой Фьючер будет вести своё вычесления. И вот в зависимости от source.value фьючер будет через всю цепочку пропускать это значение
  // почему фция source может быть передана в конструктор Future - new Future(source) ? потому что эта фция имеет контракт открытого конструктора то-есть она принимает коллбек и в этот коллбе запихивает значение

  const source = (r) => r(source.value);
  source.value = 2;

  const f1 = new Future(source)
    .map((x) => ++x)
    .map((x) => x ** 3)
    .map((x) => x * 2);

  f1.fork((x) => console.log('fork1', x));
  source.value = 3;
  f1.fork((x) => console.log('fork2', x));
  source.value = 4;
  f1.fork((x) => console.log('fork3', x));
  source.value = 5;
  f1.fork((x) => console.log('fork4', x));
}

/*
f1 fork1 6      Во-первых, мы видим что можно вызывать форк у ф1 два раза
f1 fork2 6
f2 fork1 7
f2 fork2 7
f3 fork1 343
f3 fork2 343
f4 fork1 12     Обрати внимание что 12 а не 686, те умножило именно первый фьючер
f4 fork2 12

Change initial value of chain:
fork1 54
fork2 128
fork3 250
fork4 432

  А что касаемо второго примера что Фьючер каждый раз в зависимости от значение подставляет другое значение

  Мы убедились что Фьючер у нас ленивый и не имеет внутреннего состояние и мы можем его много раз вызывать и комбинировать как захотим. Мы во-втором примере комбинируем цепочкой связывания фьючеров, кто от кого наследует
  
*/
