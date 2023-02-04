'use strict';

// здесь мы добавим методы pause и resume для того что бы мы могли создать сразу остановленную очередь как у нас в примере. То-есть там где мы пишем const queue = Queue.channels(3) мы в самом конце пишем .pause() и все таски будут в ней скапливаться в массиве waiting и не пойдут на обработку -> потом через 3 секунды сделаем resume и они будут обрабатываться -> через 1 секунду опять паузу -> еще  через 1 опять резьюм

class Queue {
  constructor(concurrency) {
    this.paused = false;
    this.concurrency = concurrency;
    this.count = 0;
    this.waiting = [];
    this.onProcess = null;
    this.onDone = null;
    this.onSuccess = null;
    this.onFailure = null;
    this.onDrain = null;
    this.waitTimeout = Infinity;
    this.processTimeout = Infinity;
  }

  static channels(concurrency) {
    return new Queue(concurrency);
  }

  wait(msec) {
    this.waitTimeout = msec;
    return this;
  }

  timeout(msec) {
    this.processTimeout = msec;
    return this;
  }

  // В методе add добавлися флаг paused - если кто-то добавляет нам элементы пока мы находимся на паузе - то мы обязтельно будем просто их в waiting пушить

  add(task) {
    if (!this.paused) {
      const hasChannel = this.count < this.concurrency;
      if (hasChannel) {
        this.next(task);
        return;
      }
    }
    this.waiting.push({ task, start: Date.now() });
  }

  // Здесь мы проверям if (!this.paused && this.waiting.length > 0) если пауза не стоит и кто-то у нас есть в очереди ожидания то только тогда мы takeNext() вызызываем если у нас особобождается один из каналом обслуживания

  next(task) {
    this.count++;
    let timer = null;
    let finished = false;
    const { processTimeout, onProcess } = this;
    const finish = (err, res) => {
      if (finished) return;
      finished = true;
      if (timer) clearTimeout(timer);
      this.count--;
      this.finish(err, res);
      if (!this.paused && this.waiting.length > 0) this.takeNext();
    };
    if (processTimeout !== Infinity) {
      const err = new Error('Process timed out');
      timer = setTimeout(finish, processTimeout, err, task);
    }
    onProcess(task, finish);
  }

  // Здесь мы в предыдущем примере рекурсивно вызывали takeNext() но здесь мы взяли и добавили условие что если кто-то стоит в очереди if (waiting.length > 0), то тогда мы разорвём обработку на setTimeout что бы у нас прокрутился event loop и если никто за это время нас не запаузил то мы тогда только сделаем takeNext()

  takeNext() {
    const { waiting, waitTimeout } = this;
    const { task, start } = waiting.shift();
    if (waitTimeout !== Infinity) {
      const delay = Date.now() - start;
      if (delay > waitTimeout) {
        const err = new Error('Waiting timed out');
        this.finish(err, task);
        if (waiting.length > 0) {
          setTimeout(() => {
            if (!this.paused && waiting.length > 0) this.takeNext();
          }, 0);
        }
        return;
      }
    }
    const hasChannel = this.count < this.concurrency;
    if (hasChannel) this.next(task);
    return;
  }

  finish(err, res) {
    const { onFailure, onSuccess, onDone, onDrain } = this;
    if (err) {
      if (onFailure) onFailure(err, res);
    } else if (onSuccess) {
      onSuccess(res);
    }
    if (onDone) onDone(err, res);
    if (this.count === 0 && onDrain) onDrain();
  }

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

  pause() {
    this.paused = true;
    return this;
  }

  // Кроме того что метод resume меняет флаш paused на false, когда мы делаем pause() то мы не можем остановить то что там сейчас обрабатывается и те кто сейчас находятся в каналах обработки - они закончат обрабатываться. Но мы не будем из очереди ожидающих из waiting массива брать новые.
  // Но в resume просто так переключить флаг - мало ! Нам нужно проверить никто ли не ожидает из этой очереди и если ожидает мы сразу проверяем есть ли у нас свободные каналы ожидания и если они есть то делаем takeNext. И в конце для чейнинга return this

  resume() {
    if (this.waiting.length > 0) {
      const channels = this.concurrency - this.count;
      for (let i = 0; i < channels; i++) {
        this.takeNext();
      }
    }
    this.paused = false;
    return this;
  }
}

// Usage

const job = (task, next) => {
  setTimeout(next, task.interval, null, task);
};

const queue = Queue.channels(3)
  .wait(4000)
  .timeout(5000)
  .process(job)
  .success((task) => console.log(`Success: ${task.name}`))
  .failure((err, task) => console.log(`Failure: ${err} ${task.name}`))
  .pause();

for (let i = 0; i < 10; i++) {
  queue.add({ name: `Task${i}`, interval: i * 1000 });
}

console.log('Start paused');

setTimeout(() => {
  console.log('Resume');
  queue.resume();
}, 3000);

setTimeout(() => {
  console.log('Pause');
  queue.pause();
}, 4000);

setTimeout(() => {
  console.log('Resume');
  queue.resume();
}, 5000);

/*
Ruslan@MacBook-Pro concurrent-async-queue % node 3-pause.js 
Start paused
Resume
Success: Task0
Pause
Success: Task1
Resume
Failure: Error: Waiting timed out Task4
Failure: Error: Waiting timed out Task5
Success: Task2
Failure: Error: Waiting timed out Task6
Failure: Error: Waiting timed out Task7
Failure: Error: Waiting timed out Task8
Failure: Error: Waiting timed out Task9
Success: Task3

  0 таск успел успешно обработать, потом кто-то запаузил, потом успешно обработалась Таск 1 и потом кто-то зарезюмел. Так произошло потому что Таск 1 был добавлен для исполнение ДО вызова pause() ! 
  А дальше полетеле ошибки потому что так как остальные Таски слишком долго ожидали и там все таймауты ожидания очереди уже вышли и по-этому все зафейлелись с Waiting timed out
*/
