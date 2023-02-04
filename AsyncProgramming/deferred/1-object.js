'use strict';

// Диферры - это тоже абстракция асинхронности, но которая  сейчас практически не используется, а вместо нее используют Промисы. В фциональном программирвоание еще Фьючеры могут использоваться
// Мы из фции будем возвращать Объект, который символизирует собой значение. Этот Объект позволяет подписаться на события получения Дифферам уже какого-то конечного зарезолвленного состояния и выполнить какуе-то фцию когда Диффер(отложенный объект) получит своё значение.

// Мы в примере прямо из фции возвращаем Объкт

const asyncResult = () => ({
  value: undefined,
  onDone: null, // есть ссылка на onDone - это какой-то подписчик, который хочет потом это значение получить

  // done - записывает коллбек в свойство onDone

  done(callback) {
    this.onDone = callback;
    return this;
  },

  // resolve кладёт value в свойство этого объект и если кто-то подписан на onDone то вызывается этот метод и передаёт туда value

  resolve(value) {
    this.value = value;
    if (this.onDone) this.onDone(value);
    return this;
  },
});

// Usage

const persons = {
  10: 'Marcus Aurelius',
  11: 'Mao Zedong',
  12: 'Rene Descartes',
};

// getPerson вернёт нам асинхронно кого-то из Объекта persons

const getPerson = (id) => {
  const result = asyncResult(); // создали новый Диферр
  // на секунды создали иммитацию работы с асинхроностью(представим что у нас идет запрос к БД)
  setTimeout(() => {
    result.resolve({ id, name: persons[id] }); // так как у нас есть ссылка на result мы отправим в result объект с айди и именнем
  }, 1000);
  return result; // сразу же его вернули
};

// Subscribe
const d1 = getPerson(10); // создаём Диффер
// здесь мы сразу подпишемся на диффер который еще не зарезолвился
d1.done((value) => {
  console.log('Resolved d1', value);
});

// Subscribe after resolve
const d2 = getPerson(11); // еще один Диффер
// мы в d2 чуть позже подпишемся, сам диффер ожидает 1 секунду, мы подпишемся через 1.5секунды, для того что бы значение внутри Диферра уже зарезолвилось const d2 = getPerson(11); и там уже будет какое-то value, и только тогда мы подпишемся
setTimeout(() => {
  d2.done((value) => {
    console.log('Resolved d2', value);
  });
}, 1500);

/*
Resolved d1 { id: 10, name: 'Marcus Aurelius' }
Мы видим что второй к нам не пришел вообще, это происходит по той приччине, что у нас при подписке d2.done() когда мы вызываем метод done и туда фцию передаём, то коллбек сохраняется в свойство и мы совершенно не знаем, а вдруг уже value есть и может можно было бы не сохрнаять его в свойство, а сразу вызвать этот коллбек
  То-есть такая реализация Диффера с асинхроностью не совсем дружит, потому что асинхронность предпологает что подписки могут происходить не сразу после создание Объектов, а чуть позже
*/