'use strict';

// фция getPerson имуулирует работу с БД(берёт информаю о юзере)

const getPerson = (id) => {
  const thenable = {
    then(onFulfilled1) {
      // при помощи setTimeout мы иммулируем как буд-то у нас асинхронная операция
      setTimeout(() => {
        // внутри создаем объект
        const person = { id, name: 'Marcus Aurelius' };
        // и сразу его возвращаем
        onFulfilled1(person);
      }, 1000);
    },
  };
  // мы бь могли сразу этот объект thenable в return написать, но так у него бы не было названия, если фции мы можем дать название если мы её сразу возвращаем, а с объектами так нельзя
  // по-этому для читабильности кода Тимур его назвал
  return thenable;
};

// Usage

(async () => {
  const person = await getPerson(10); // здесь мы расспакуем этого person
  console.dir({ person });
})();

// { person: { id: 10, name: 'Marcus Aurelius' } }
