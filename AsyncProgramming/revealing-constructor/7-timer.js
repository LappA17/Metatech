'use strict';

// Отталкиваясь от паттерна мы можем строить свои асбтракции

// interval - интервал с которым вызывать
// listener - фция которая будет вызываться каждых interval секунд

class Timer {
  constructor(interval, listener) {
    this.interval = interval;
    this.enabled = false;
    this.listener = listener;
    this.timer = null;
  }

  start() {
    if (this.enabled) return;
    this.enabled = true;
    this.timer = setInterval(this.listener, this.interval);
  }

  stop() {
    if (this.enabled) {
      clearInterval(this.timer);
      this.enabled = false;
    }
  }
}

// Uasge

// вот все что в const timer - это открытый конструктор, когда в конструктор передаётся фция которая хранится там где-то внутри и хранится внутри инстенса этого Объекта и что-то там делает меняя его повденеие или используется вместо какого-то метода. Одним словом меняет поведение базового класса
// передавать эту фцию можно по-разному, в Промисах или в этом Таймере в виде аргумента или как в стримах в виде передачи объекта и внутри уже именнованные фции
const timer = new Timer(1000, () => console.log('Timer event'));

timer.start();
setTimeout(() => timer.stop(), 5000);

/*
Timer event
Timer event
Timer event
Timer event
*/
