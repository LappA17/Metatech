'use strict';

// В этом примере мы допишем пайпы, что бы можно было делать Очередь Источник, Очередь Приёмник и когда оно сначалао в Очереди источнике оно успешно обработается -> то тогда отправляется в очередь Приёмник !

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
    this.destination = null;
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

  // мы будем вызывать наш destination когда в первой очереди успешно обработался наш реузльтат this.destination.add(res); То-есть когда случается успешная обработка - мы отправляем в onSuccess и только после этого в destination

  finish(err, res) {
    const { onFailure, onSuccess, onDone, onDrain } = this;
    if (err) {
      if (onFailure) onFailure(err, res);
    } else {
      if (onSuccess) onSuccess(res);
      if (this.destination) this.destination.add(res);
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

  priority(flag = true) {
    this.priorityMode = flag;
    return this;
  }

  pipe(destination) {
    this.destination = destination;
    return this;
  }
}

// Usage

// destination - это Очередь с двумя каналами
// next(null) первым аргументом ошибка идёт
// { ...task, processed: true } - мы расспаковали task и добавили поле processed: true - которое означает что он отпроцессирован этим destination стримом. Те мы расспаковали все поля из таска и добавили еще одно поле processed

const destination = Queue.channels(2)
  .wait(5000)
  .process((task, next) => next(null, { ...task, processed: true }))
  .done((err, task) => console.log({ task }));

// .pipe(destination) - когда обработка закончится успешно(то-есть этот таймаут timeout(4000) обработку не погасит) то мы будем это запихивать в destination

const source = Queue.channels(3)
  .timeout(4000)
  .process((task, next) => setTimeout(next, task.interval, null, task))
  .pipe(destination);

// мы отправляем элемент в source через source.add и они уже сами перекладываются в destination и там уже пичатаются из метода .done() в const destination

for (let i = 0; i < 10; i++) {
  source.add({ name: `Task${i}`, interval: 1000 });
}

/*
{ task: { name: 'Task0', interval: 1000, processed: true } }
{ task: { name: 'Task1', interval: 1000, processed: true } }
{ task: { name: 'Task2', interval: 1000, processed: true } }
{ task: { name: 'Task3', interval: 1000, processed: true } }
{ task: { name: 'Task4', interval: 1000, processed: true } }
{ task: { name: 'Task5', interval: 1000, processed: true } }
{ task: { name: 'Task6', interval: 1000, processed: true } }
{ task: { name: 'Task7', interval: 1000, processed: true } }
{ task: { name: 'Task8', interval: 1000, processed: true } }
{ task: { name: 'Task9', interval: 1000, processed: true } }

То-есть по 3 на каждой иттерации
То-есть они нормально печатаются, они пайпаятся с одного на другой
*/

/*
    У нас очереди решают какую проблему ? Когда у нас на вход в высоконагруженную часть программы есть большой поток заявок на обработку каких-то запросов, то мы хотим не перенагрузить эту часть программы и значит поставить там таймауты, очереди для ожидания и всё это дело что бы одновременно обрабатывалось не больше n-ого кства запросов, в нашем случае 3 канала, в реальном проекте там к примере 100 каналов и очередь к примеру не больше 1000 элементов
    Это уже снизит нагрузку - кто-то не дождался очереди, кто-то канала обработки и мы уже часть запросов выплюнем ! Потому что лучше отдать пользователю ошибку что вы слишком долго обрабатывали чем у нас вся система захлебнётся и у нас вообще никакие запросы не будут обрабатываться. Лучше часть из них обработуются а часть отсеется

    У нас в очередяъ было бы хорошо добавить что-то такое как Фактор
    Так же мы можем хотеть ограничеть обработку только части запросов, к примеру запросы которые приходят от одного и того же Пользователя должны становится в специальную очередь именно для этого пользователя, что бы этот пользователь не мог обработать больше n-ого кства запросов, а другие сколько захотят. К примеру у нас есть общее ограничение в системе + для каждого конкретного пользователя еще ограничения. И мы обзываем этого пользователя еще каким то Фактором очереди и имя или айдишник этого пользователя закодировать и представить в виде числа, потому что Фактор - это у нас какое-то число. И мы на вход когда add делаем, мы передаём и приоритет и фактор и эта очередь уже не знает ничего о пользователе, а она оперирует числом, она смотрит если число 100, то все кто с числом 100 приходит становятся друг за другом в очередь, а кто пришел с очередью 101 уже станет в очередь рядом, то-есть очередь 100 не будет мешать обрабатываться очереди 101
    То-есть у нас будет метод:
    add(task, factor = 0, priority = 0) {} 
    и мы в этот factor будем передавать какое-то число которое будет закодированно относительно к примеру айди пользователя или тип чего-то там и тд, таким образом будем делать уникальные очередя для того или инного пользователя, или к примеру мы хоти ограничить относительно того куда идут запросу, к примеру к Таблице User будут иметь factor = 1, а запросы Таблица Article будут идти к фактору = 2
    Так же приоритет играет важную роль, к примеру нам присилал запрос и Юзер и Админ и Админ должен иметь больше приоритет чем Юзер

*/
