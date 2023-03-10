'use strict';

// future - это абстракиця асинхронности, которая не имеет состояния
// так же как и Промисы future напианны при помози открыттого консткруктора
// Нам нужно сделать такую асьтракцию для работы с асинхроностью как lazy(ленивой), что бы она не как Промисы которые сразу же начинают резолвиться(когда мы пишем Промис и передаём туда фцию экзекьютор с резолвом и реджектом, то этот экзекьютор сразу после микротаска начинает исполняться, то-есть Промис сразу начинает его резолвить). А мы сделаем такую абстракцию которая начнет резолвиться после того как кто-то сначала на неё подпишется, а потом ее запустит(то-есть мы сначала подготвоим последовательно асинхронно операции, мы их выстроим и только потом запустим)

// В этом первом примере мы future специально построим не правильно
// ниже Тимур расскажет почему не правильно

// const future - это функция Фабрика, она возвращает экземпляры Объекта
// метод map будет рекурсивно вызывать новый Фьючер: map кладёт фцию которая приходит ему в аргумент в замыкание, эта фция попадает в mapper и потом return future(this) - то-есть рекурсивно вызывает сама себя
// метод fork() - в него будет приходить коллбек successed и мы этот коллбек потом должны вызвать вернув в него резлуьтат. Но этот результат может быть вызван двумя разными способами. Дело в том что этот результат может быть сразу известен, а может оказаться что у нас в качестве значения внутри этого Фьючера используется другой Фьючер и мы здесь это проверяем if (value.fork) если этот value нам приходил в аргумент const future = (value), то-есть value тоже имеет метод fork то это тоже future, но тут очень плохая типизация, потому что мы проверяем фьючер ли это только по методу fork
// и если value это future if (value.fork) то мы ретёрним этот велью вызывая форк и передаём фцию финиш value.fork(finish), и эта фция финиш обработает этот коллбек и отдаст его в successed
// а если там не другой фьючер, а просто какое-то значение(оно может быть там Скалярное или Ссылочное), то мы сразу вызываем finish и передаём туда то значение которое в этом future и лежало
// посмотрим фцию finish. Тут мы проверяем если у нас есть mapper(то-есть этот фьючер написан так что он умеет приобразовывать положенное в него значение через фцию map), то мы сначала вызываем этот mapper, в него передаём result который мы взяли из value -> нам mapper что-то вернёт и это мы вызовим на successed. А если никто метод map не вызывал над этим future то мы результат сразу возвращаем successed(result);

// Проблемы данного future: 1) утинная типизаци на проверку явялется ли value другим future только через наличие у него метода fork 2) у нашего future есть состояние - value которое в него приходит 3) mapper, те у нашей фции future два индификатора которые привязаны к этому future, а мы бы хотели что бы у нас future был чистым, без внутреннего состояня что бы его можно было использовать много раз

const future = (value) => {
  let mapper = null;
  return {
    map(fn) {
      mapper = fn;
      return future(this);
    },

    fork(successed) {
      const finish = (result) => {
        if (mapper) successed(mapper(result));
        else if (successed) successed(result);
      };
      if (value.fork) return value.fork(finish);
      finish(value);
    },
  };
};

// Usage

// У нас ниже примеры с future и анлалогичный с промисом
// пример использования такой же самый как в примере с Промисами ниже
// самое главное отличие что пока мы не вызовем метод fork() у future1 то эта цепочка map не будет выполняться !!!

console.log('start begore future'); // мой console, не Тимура

const future1 = future(5)
  .map((x) => {
    console.log('future1 started');
    return x;
  })
  .map((x) => ++x)
  .map((x) => x ** 3)
  .map((x) => {
    console.log('future1 result', x);
  });

console.dir({ future1 });
future1.fork();

console.log('end after future'); // мой console, не Тимура

// Промис сразу же резолвиться вот здесь Promise.resolve(6)
// потом мы на него подписываемся
// и по цепочки из одного then в другой будем передавтаь результат и в конце в консоль выведим информацию о результате работы промиса
// после каждого then происходит создание Нового Промиса и мы на него подписываемся
// и в переменную promise1 попадёт именно тот Промис который вернулся из Последнего then !

console.log('start begore promise'); // мой console, не Тимура

const promise1 = Promise.resolve(6)
  .then((x) => {
    console.log('promise1 started');
    return x;
  })
  .then((x) => ++x)
  .then((x) => x ** 3)
  .then((x) => {
    console.log('promise1 result', x);
  });

console.dir({ promise1 });

console.log('end after promise'); // мой console, не Тимура

/* future1.fork() - ЗАКОММЕНТИРОВАН
{ future1: { map: [Function: map], fork: [Function: fork] } }
{ promise1: Promise { <pending> } }
promise1 started
promise1 result 343

  Нам отсюда даже не видно что у Фьючера даже есть какое-то состояние
  пока мы не вызовим fork(форк это аналог then только который принуждает future начать считать), то состояния так и не появится

  Пример с .fork()
{ future1: { map: [Function: map], fork: [Function: fork] } }
future1 started
future1 result 216

  Наш фьючер так как он объявлен раньше отработает тоже раньше

  Теперь я расставил консоль логи что бы сравнить код на синхронность
start begore future
{ future1: { map: [Function: map], fork: [Function: fork] } }
future1 started
future1 result 216
end after future
start begore promise
{ promise1: Promise { <pending> } }
end after promise
promise1 started
promise1 result 343
*/
