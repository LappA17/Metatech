'use strict';

// В этом примере мы добавим максимальный интервал ожидание и максимальный интервал обрабртки
// нам это нужно что бы в очереди не скапливался длинный хвост и что бы таски которые долго обрабатывались на блокировали систему, потому что приложение должно работать не зависимо если кто-то написал неоптимальный код

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
    this.waitTimeout = Infinity; // по-дефолту бесконечно ожидаем пока один элемент обработается
    this.processTimeout = Infinity; // по-дефолту бесконечно кство времени в очереди пока мы ждём обработки
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

  add(task) {
    const hasChannel = this.count < this.concurrency;
    if (hasChannel) {
      this.next(task);
      return;
    }
    // теперь вместо того чтобы в массив ожидание класть один элемент, мы кладём аж целую сруктуру
    // в start мы засекаем в мсекундах когда он пришел(это нам нужно для того что бы потом их выбрасывать)
    this.waiting.push({ task, start: Date.now() });
  }

  // Здесь мы уже добавим таймер и флаг финиш(что бы понять закончилась ли обработка)
  // мы создаём фцию finish которую будем вызывать в двух случаях: либо на таймере - finish(err, task); либо на коллбеке - onProcess(task, finish); и из-за того что это может случится в этих двух случаях мы и обернули весь этот код внутри в две функции, то-есть у нас может быть задан таймАут в обработке, либо он не задан
  // Если у нас есть processTimeout в обработке(те он НЕ Инфинити) то мы ставим в timer сетТаймаут. И если этот setTimeout сработает быстрее чем finish вызовится ниже в onProcess(task, finish); то нам уже не нужно будет дожидаться onProcess, сетТаймаут вызовит finish и аргументами передаст ему ошибку и таск
  // Теперь посмотрим фцию finish. Если флаг finished уже стоит - значит таймаут не успел и мы сразу выходим и дальше мы флаг ставим true, те если финишед не успеет очиститься, фция finish была вызвана с onProcess и у нас флаг финишед для этого и нужен
  // this.count--; вычисляем единицу из кства обрабатываемых элементов
  // и вызываем фцию finish у самого класса(а не эте const finish) и туда ошибку и таск передаём
  // и в конце после того как освободился один канал мы проверим или кто-то ожидает и вызовем takeNext()

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
      if (this.waiting.length > 0) this.takeNext();
    };
    if (processTimeout !== Infinity) {
      timer = setTimeout(() => {
        timer = null; // мы в случае чего очистили переменную таймер и тогда в фции finish не нужно будет делать clearTimeout(timer)
        const err = new Error('Process timed out');
        finish(err, task);
      }, processTimeout);
    }
    onProcess(task, finish);
  }

  // takeNext умеет проверять нашу очередь и брать из неё следующий элемент
  // но мы не можем просто так оттуда shiftoм взять следующий элемент
  // мы берём след задачу const { task, start } = waiting.shift();
  // и дальше проверяем что если у нас есть таймаутОжидания то мы должны там их выбрасывать
  // а если таймаута ожидания нет то мы можем сразу их отправлять в некст задачу this.next(task);
  // а если есть таймаут то мы выщитываем сколько он там ожидал, мы берём текущее время и отнимает оттуда старт
  // если ожидал больше чем нужны то генерируем ошибку и отправляем её в финиш
  // потом мы проверяем нет ли там в массиве ожидающих еще элементом и если есть рекурсивно вызввать еще раз метод takeNext(), при этом вызываем мы его синхронно, но если бы мы хотели что бы он работал асинхронно, то вызывать его так рекурсивно из самого себя нельзя ! нам нужно будет разорвать хотя бы на сетТаймаут 0. Проблема вызова рекурсивно фции самой себя в том что может оказаться что наша очередь очень большая и она будет там тормозить и лучше её таймаутом разорвать(хотя тоже зависит от размера очереди)

  takeNext() {
    const { waiting, waitTimeout } = this;
    const { task, start } = waiting.shift();
    if (waitTimeout !== Infinity) {
      const delay = Date.now() - start;
      if (delay > waitTimeout) {
        const err = new Error('Waiting timed out');
        this.finish(err, task);
        if (waiting.length > 0) this.takeNext();
        return;
      }
    }
    this.next(task);
    return;
  }

  // Сюда отправляется весь этот код который проверяет события: onFailure, onSuccess, onDone, onDrain
  // и если они там есть то расспихивает данные по этим событиям

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
  .drain(() => console.log('Queue drain'));

for (let i = 0; i < 10; i++) {
  queue.add({ name: `Task${i}`, interval: i * 1000 });
}

/*
Ruslan@MacBook-Pro concurrent-async-queue % node 2-timeouts.js 
Success: Task0
Success: Task1
Success: Task2
Success: Task3
Success: Task4
Failure: Error: Waiting timed out Task7
Failure: Error: Waiting timed out Task8
Failure: Error: Waiting timed out Task9
Failure: Error: Process timed out Task5
Failure: Error: Process timed out Task6
Queue drain

C 0 по 3 таск все очень быстро отработала, а 7,8,9 таска выплюнулось с Фейлур по приччине того что слишком долго ожидались в очереди, и просто не дождались
А вот 5 и 6 уже получили Process timed out потому что в очередь попали по раньше, но долго обрабатывались
*/
