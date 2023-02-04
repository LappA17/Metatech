'use strict';

// Добавим в нашу Конкурентную очередь Приоритетность

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
    this.priorityMode = false;
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

  // Здесь в add добавился аргумент priority
  // this.waiting.push({ task, start: Date.now(), priority }); здесь в структуре ожидающих поле на исполнение мы еще и priority пишем, до этого только таск и старт
  // плюс мы должны отсортировать массив ожидающих тасков по приоритету если приоритет установлен в true

  add(task, priority = 0) {
    if (!this.paused) {
      const hasChannel = this.count < this.concurrency;
      if (hasChannel) {
        this.next(task);
        return;
      }
    }
    this.waiting.push({ task, start: Date.now(), priority });
    if (this.priorityMode) {
      this.waiting.sort((a, b) => b.priority - a.priority);
    }
  }

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

  // если передать priority(false) то приоритетность выключится

  priority(flag = true) {
    this.priorityMode = flag;
    return this;
  }
}

// Usage

const job = (task, next) => {
  setTimeout(next, task.interval, null, task);
};

// Здесь все как в предыдущих примерах, только мы вызввали уже метод priority()
// он переключает асинхронную очередь на работу с приоритетами
// и теперь когда мы будем вызывать метод add, то он будет ожидать что к нему первым аргуметом приходит элемент который становится в очередь { name: `Task${i}`, interval: 1000 }, а второй аргумент уже приоритет - в нашем случае i будет приоритет

const queue = Queue.channels(3)
  .process(job)
  .priority()
  .done((err, task) => console.log(`Done: ${task.name}`))
  .drain(() => console.log('Queue drain'));

// у каждой следующей задачи приоритет будет больше
// у всех задач интервал секунда - это значит что они все одной длины, но те которые добавились последними должны в обратном порядке выполнится из-за приоритета, крмое первых ТРËХ потому что первые три зашли на исполнения сразу же, первые три исполнятся в правильно порядке 0, 1, 2

for (let i = 0; i < 10; i++) {
  queue.add({ name: `Task${i}`, interval: 1000 }, i);
}

/*
Done: Task0
Done: Task1
Done: Task2
Done: Task9
Done: Task8
Done: Task7
Done: Task6
Done: Task5
Done: Task4
Done: Task3
Queue drain
*/
