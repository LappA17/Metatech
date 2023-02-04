'use strict';

// Реализация для мастера(у нас их две: для мастера и для воркера) она умеет стартовать, держать в памяти специальную структуру данных, которая хранит в себе все акторы и если какой-то актор присылает Мастеру сообщение по этой таблице const actors = new Map(); - это наша структра данных в которой лежат все акторы, то мастер найдет необходимый актор и перешлет это сообщение
// если в предыдущим примере у нас модель акторов на самом деле скрывала события от самих акторов(те акторы отправляли событие а внутри реализация все равно делала вызовы - получая событие от одного актора, она делала вызов к другому), то тут у нас происходит полная сериализация данных, которые приходят на события, отправка их через интер-процесс-комьюникейшен(через ipc встроенный в опперационную систему)
// Посмотрим как мы это делаем: у нас есть библиотечка child_process, которая позволяет нам стартовать(форкать) новые процессы
// мы внутри метода start форкаем процесс const actor = cp.fork('./system.js'); и тоже форкуем его начиная с модуля system, только когда мы отправляемся уже в этот форк то у нас process.channel уже Не будет равен undefined(мы сейчас говорим за файл system.js), те если в мастер процессе process.channel был бы равен undefined, потому что не было канала взаимодейсвтия мастер процесса не с кем другим, то вот у Воркера канал взаимодействия с Мастером уже есть и мы пойдем по ветке где зареквается worker, а в Мастер не пойдём

const cp = require('node:child_process');

const actors = new Map();

class MasterSystem {
  // метод старт в Мастере в отличие от Воркера реализован по другому
  // здесь когда у нас не было еще ниодного актора с этим именнем - actors.has(name) будет равен false
  // потом мы будем создавать структуру данных в памяти и положим её в коллекцию акторов по опредленному именни -  actors.set(name, { ready, instances, queue });

  static start(name, count = 1) {
    if (!actors.has(name)) {
      const ready = []; // массив всех свободных акторов
      const instances = []; // массив всех акторов
      const queue = []; // очередь задач. Когда в ready будет пустой массив, то месседжы которые приходят на этого актора будем класть в queue
      actors.set(name, { ready, instances, queue });
    }
    const { ready, instances } = actors.get(name);
    for (let i = 0; i < count; i++) {
      const actor = cp.fork('./system.js'); // форкаем новый процесс - создаём нового актора
      // вызываем метод subscribe потому что этот актор тоже будет Мастеру присылать какие-то сообщения
      MasterSystem.subscribe(actor);
      // потом добавляю его в два массива ready, instances
      ready.push(actor);
      instances.push(actor);
      // отправляю процессу сообщение старт, что бы он там внутри приинициализирвоался определенным классом актора
      // у нас в const actor = cp.fork('./system.js'); создаётся новый процесс и там внутри пока что аткор не создан и он создаться только после того как мы в него actor.send сделаем, и он благодаря name берёт из папки actors определнный актор и инициализируется им
      actor.send({ command: 'start', name });
    }
  }

  // что бы произошел стоп - нам нужно проиттерироваться по всех акторам и каждому отправить команду stop
  // нам не нужно отправять имя в send, потому что мы уже взяли коллекцию всех инстенсов по определённому именни - const record = actors.get(name); и они там уже отфильтрованны

  static stop(name) {
    const record = actors.get(name);
    if (record) {
      const { instances } = record;
      for (const actor of instances) {
        actor.send({ command: 'stop' });
      }
    }
  }

  static send(name, data) {
    // ищем акторы по именни
    const record = actors.get(name);
    if (record) {
      // берём оттуда два массива: готовые к использованнию акторы и очередь
      const { ready, queue } = record;
      // забераем одного актора
      const actor = ready.shift();
      // если ниодного актора там нету
      if (!actor) {
        // то мы добавляем этот в очередь и выходим
        queue.push(data);
        return;
      }
      // а если актор имеется, то мы ему отправляем command: 'message' и туда данные привешиваю
      actor.send({ command: 'message', data });
    }
  }

  // что будет когда в очереди стоят задачи, а актор освободитлся ? Когда случается завершение какой-то задачи
  // если нам аткор присылает сообщение === ready, то-есть наш актор готов. Дальше читай в блоке command === ready

  static subscribe(actor) {
    actor.on('message', (message) => {
      const { command, name } = message;

      // если нам будут приходить команды message, start и stop то мы просто перенаправим их в одноименные методы класса MasterSystem

      if (command === 'message') {
        const { data } = message;
        MasterSystem.send(name, data);
        return;
      }
      if (command === 'start') {
        const { count } = message;
        MasterSystem.start(name, count);
        return;
      }
      if (command === 'stop') {
        MasterSystem.stop(name);
        return;
      }
      if (command === 'ready') {
        // мы по процесс айди(pid)
        const { pid } = message;
        // находим все акторы с этим именним
        const record = actors.get(name);
        if (record) {
          const { ready, instances, queue } = record;
          for (const actor of instances) {
            // находим актор с этим айди(pid) и перекладываем его в ready, те из instances берём и кладём его в ready
            if (actor.pid === pid) ready.push(actor);
          }
          // вот здесь значит что один из акторов освободился и мы проверим в очереди какая-то задача стоит ?
          if (queue.length > 0) {
            // если задача в очереди стоит то мы её забераем
            const next = queue.shift();
            // и отправляем при помощи MasterSystem.send() на актор определенного именни
            MasterSystem.send(name, next);
          }
        }
      }
    });
  }
}

module.exports = MasterSystem;
