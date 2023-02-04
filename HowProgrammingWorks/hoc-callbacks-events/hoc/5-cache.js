'use strict';

// В этомм примере мы готовимся к мемоизации функции. Мемоизация - это когда функциональность по кешированию выделяются в отдельную абстракцию. Здесь же у нас в эту функцию fn наш cache просто захардкоден

const fn = () => {
  console.log('Generate cache');
  const cache = {}; // сюда будем что-то сохранять
  // лямбда которую мы возвращаем из fn дальше по ходу своей работы будет как-то мутировать наш cache
  return (key) => {
    let res = cache[key]; // если в кеше есть ключ который передан в виде аргумента key, то мы мы сразу берем из кеша результат
    if (res) {
      console.log('From cache');
      return res;
    }
    // а если в кеше результата нет то здесь будем его вычеслять
    console.log('Calculate and save to cache');
    res = 'value' + key;
    cache[key] = res;
    return res;
  };
};

// и функция f1 и f2 - это два экземпляара лямбды которая возвращается из функции fn ! только у них разные замыкание
const f1 = fn();
const f2 = fn();

// первые два вызовы должны вычеслится f1(1); и f1(2);, а остальные f1(1) и f1(2) должны уже взяться из Кеша потому что уже такая операция была !

f1(1);
f1(2);
f1(1);
f1(2);

// тут все точно так же как с f1, два раза генерируется Кеш и потом два раза возьмется из кеша

f2(1);
f2(2);
f2(1);
f2(2);
