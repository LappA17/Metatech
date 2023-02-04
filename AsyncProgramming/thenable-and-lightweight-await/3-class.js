'use strict';

class Result {
  then(onFulfilled) {
    this.onFulfilled = onFulfilled;
  }

  // Тимур специально не назвал метод resolve, а ready что бы подчеркнуть что это не Промис, а объект который имеет чуть другой контракт
  // и он одинаковый с Промисом на уровне того что метод называется then

  ready(data) {
    // если кто-то вызвал then и обработчик уже ожидает данные тогда мы можем эти данные уже прислать
    if (this.onFulfilled) this.onFulfilled(data);
  }
}

// у нас есть для примера какой-то там Security провайдер, у которого есть статические методы и один из них getPerson по айди
// и мы внутри этого метода создаем new Result у которого есть метод then

class Security {
  static getPerson(id) {
    const res = new Result();
    setTimeout(() => {
      const person = { id, name: 'Marcus Aurelius' };
      res.ready(person);
    }, 1000);
    return res;
  }
}

// Usage

(async () => {
  const person = await Security.getPerson(10);
  console.dir({ person });
})();
