'use strict';

// Наши массивы в Ноде работают почти как Очередь(можно сделать в него push и оттуда shift - мы можем добавлять в конец и забирать с начала, но она работает НЕ асинхронно)
// нам бы хотелось сделать асинхронность, а во-вторых нам бы в очередь сделать приоритеты, пайпы, события для подписки

// Разница между rx и очереди есть, rx - это потоки событий, а очередь - это всё таки структура данных, у них разыне контракты но похожее поведение
// Первое в чем разница rxами с обсерваблами - то что у нас очередь базируется на Теории Очередей(или теория массового обслуживания) и там есть каналы обслуживания

// Очередь у нас - это класс у которого количество каналов(или уровень конкурентности, в англ терминологии звучит так что уровень конурентности передаёт в Конструктор и мы его запихиваем в свойства)
// count - это кство которое в данный момент обрабатывается
// waining - это где запросы будут ожидать, если вдруг count будет равен concurrency, те все каналы загруженные, то в это массиве waiting они будут ожидать
// и дальше уже идут сами обработчике, которые по-дефолту null, что бы структура Объекта не модифицировалась
// У нас еще есть Фабрика - static channels, куда мы тоже передаём конкретность для того что бы писать Queue.channels что бы создавтаь без new - Тимуру так просто больше нравится писать, для симантики, что бы сразу было видно что три канала
// метод add у нас умеет туда какое-то значение присылать, это может быть разное значение, но обычно это ссылочное значение(какие-то объекты)

class Queue {
  constructor(concurrency) {
    this.concurrency = concurrency;
    this.count = 0;
    this.waiting = [];
    this.onProcess = null;
    this.onDone = null;
    this.onSuccess = null;
    this.onFailure = null;
    this.onDrain = null;
  }

  static channels(concurrency) {
    return new Queue(concurrency);
  }

  // первыдм делом когда мы добавляем новое значение - мы должны проверить есть ли у нас свободный канал
  // для этого мы сравниваем this.count < this.concurrency;
  // если hasChannel в true то начинаем обработку этого таска, иначе добавляем в waiting

  add(task) {
    const hasChannel = this.count < this.concurrency;
    if (hasChannel) {
      this.next(task);
      return;
    }
    this.waiting.push(task);
  }

  // метод next() умеет начинать обработку таска
  // мы передаём такск на вход (task) и сразу увеличиваем счетчик на один - на текуще обрабатываемых тасков
  // вызываем onProcess, и мы предпологаем что onProcess у нас всегда должен быть, все остальны обработчики - необязательные, а вот онПроцесс всегда должен быть потому что очередь же обрабатывает кого-то
  // мы даем этому onProcess этот таск и подписываемся коллбеком на то когда нам онПроцесс обработает
  // если возвращается ошибка то передаём её в соотвественый обрбаотчик onFailure
  // если результат пришел то проверяем есть ли onSuccess и в него передаём
  // потом проверяем есть ли обрбаотчик onDone и туда даём и ошибку и результат вместе
  // дальше когда все события повызывали - мы уменьшаем счетчик this.count-- что бы освободить один канал
  // и как только мы освободили канал - нам нужно проверить кто-то у нас ожидает ? потому что у нас освободилось одно место
  // и если ожидает то мы берём с массива ожидающих оди элемент и рекурсивно передаём в метод next() и сразу выйти
  // и если нас никто не ожидал и текущее кство обрабатываемых тасков ровно 0 - то очередь и каналы обслуживание ПУСТЫЕ и нужно выщвать onDrain

  next(task) {
    this.count++;
    this.onProcess(task, (err, result) => {
      if (err) {
        if (this.onFailure) this.onFailure(err);
      } else if (this.onSuccess) {
        this.onSuccess(result);
      }
      if (this.onDone) this.onDone(err, result);
      this.count--;
      if (this.waiting.length > 0) {
        const task = this.waiting.shift();
        this.next(task);
        return;
      }
      if (this.count === 0 && this.onDrain) {
        this.onDrain();
      }
    });
  }

  // все остльные методы - приметивные, они просто умеют сохранять listener или коллбеки в свойстов и делать ретёрн this для чейнинга

  process(listener) {
    this.onProcess = listener;
    return this;
  }

  done(listener) {
    this.onDone = listener;
    return this;
  }

  success(listener) {
    this.onSuccess = listener;
    return this;
  }

  failure(listener) {
    this.onFailure = listener;
    return this;
  }

  drain(listener) {
    this.onDrain = listener;
    return this;
  }
}

// Usage

const job = (task, next) => {
  console.log(`Process: ${task.name}`);
  setTimeout(next, task.interval, null, task);
};

// Здесь мы создаём Трёхканальную Очередь. Навешиваем на неё процедуру которая будет на всех трёх каналах сидеть и её обрабатывать - process()
// Дальше навешиваем .done и лямбду которая в него приходит - это обработчик который будет вызван когда обработка закончится(не важно успешно или не успешно - но он вызвится)
// Потом у нас два обработчика на успешную и неуспешную обработку
// drain - обработчик в самом конце, когда все три канала будет опусташены
// а еще кроме этого у нас есть ожидание - пока все три канала заняты все эти Три элементы должны ожидать

const queue = Queue.channels(3)
  .process(job)
  .done((err, res) => {
    const { count } = queue;
    const waiting = queue.waiting.length;
    console.log(`Done: ${res.name}, count:${count}, waiting: ${waiting}`);
  })
  .success((res) => console.log(`Success: ${res.name}`))
  .failure((err) => console.log(`Failure: ${err}`))
  .drain(() => console.log('Queue drain'));

// Создав очередь и навесим на неё обработчики мы идём и forам ее заполняем

for (let i = 0; i < 10; i++) {
  // мы создаём объекты с именем таска по номеру и там будет интервал, который мы будем использовать на нашей задаче фция job
  // которая навешана на очередь job - он будет просто делать setTimeout и вызывтаь next, типа он обработал этот элемент, и
  // в этот next будет приходить null и task как аргументы setTimeout(next, task.interval, null, task);
  queue.add({ name: `Task${i}`, interval: i * 1000 });
}

/* 
  Первые три таска сразу выполнятся, остальные уже в одном интервале

Ruslan@MacBook-Pro concurrent-async-queue % node 1-channels.js 
Process: Task0
Process: Task1
Process: Task2
Success: Task0
Done: Task0, count:3, waiting: 7
Process: Task3
Success: Task1
Done: Task1, count:3, waiting: 6
Process: Task4
Success: Task2
Done: Task2, count:3, waiting: 5
Process: Task5
Success: Task3
Done: Task3, count:3, waiting: 4
Process: Task6
Success: Task4
Done: Task4, count:3, waiting: 3
Process: Task7
Success: Task5
Done: Task5, count:3, waiting: 2
Process: Task8
Success: Task6
Done: Task6, count:3, waiting: 1
Process: Task9
Success: Task7
Done: Task7, count:3, waiting: 0
Success: Task8
Done: Task8, count:2, waiting: 0
Success: Task9
Done: Task9, count:1, waiting: 0
Queue drain
*/
