'use strict';

// Воркер реализация сводится к тому что если кто-то хочет стартовать какой-то процесс, то мы просто это сообщение форвардим ,через process.send, на Мастер процесс - process.send({ command: 'start', name, count });
// Если кто-то хочет стопнуть то тоже форвардим и отправляем сообщени на Мастер процесс, то-есть мы в любом случае обращаемся к мастер процессу, потому что он управляет всей этой развёрнутой стадом аткором в памяти

class ActorSystem {
  // register нам необходим что бы актор, который запустился внутри этого workerа - мог вызвать ActorSystem.register и смог сохранить экземпляр себя внутри этой переменной  ActorSystem.actor = actor;
  // Таким образом у нас не особо прямо, но реализован Singleton. У нас в ActorSystem.actor сохранится ссылка на класс актора, а в ActorSystem.instance сохранится ссылка на экземпляр Актора

  static register(actor) {
    ActorSystem.actor = actor;
  }

  static start(name, count = 1) {
    process.send({ command: 'start', name, count });
  }

  static stop(name) {
    process.send({ command: 'stop', name });
  }

  static send(name, data) {
    process.send({ command: 'message', name, data });
  }
}

ActorSystem.actor = null;
ActorSystem.instance = null;

// мы должны погасить control + C , те если кто-то присылает SIGINT этому процессу, который в Воркере работает, то мы должны это предотвратить что бы он сам не выходил

process.on('SIGINT', () => {});

// Здесь мы слушаем события, которые приходят с Мастера и здесь мы уже проверяем если команда === старт то делаем что-то

process.on('message', (message) => {
  const { command } = message;
  if (command === 'start') {
    const { name } = message;
    // мы будем искать этого актора в папочке actors(там будет его имя .js) и мы его require
    require(`./actors/${name.toLowerCase()}.js`);
    // после того как он зарекваерился - он записал ссылку на класс актора в ActorSystem.actor, потому что он там зарегестрировался и мы можем вычитать из ActorSystem.actor имя класса
    const ActorClass = ActorSystem.actor;
    // теперь мы уже создаём экземпляр и помещаем этот экземпляр в поле instance
    ActorSystem.instance = new ActorClass();
    return;
  }
  if (command === 'stop') {
    // берём instance который хранится в текущем процессе(в текущем акторе)
    const { instance } = ActorSystem;
    // вызываем у него метод exit
    if (instance) instance.exit();
    // выходим из этого процесса
    process.exit(0);
  }
  if (command === 'message') {
    // если кто-то присылает сообщение то мы опять берём инстенс
    const { instance } = ActorSystem;
    // мы проверяем есть ли там инстенс потмоу что он мог не успеть создаться
    if (instance) {
      const { data } = message; // из месседжа берём кусок данных
      // берём из конструктора актора(в ActorSystem.actor там конструктор лежит), мы из него берём name
      const { name } = ActorSystem.actor;
      // здесь мы выполняем задачу в этом акторе - мы этот message на инстенс послали
      instance.message(data);
      // а здесь мы уведомим Master процесс о том что мы уже свободны
      // и здесь нужно уже указать наш процесс айди, потому что там может быть акторо с этим именнем несколько штук, по-этому мы ему передаём процесс айди - pid: process.pid
      process.send({ command: 'ready', name, pid: process.pid });
    }
  }
});

module.exports = ActorSystem;
