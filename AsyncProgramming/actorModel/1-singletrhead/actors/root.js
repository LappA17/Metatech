'use strict';

const ActorSystem = require('../system');

// Мы в main.js запускаем актор Root вот здесьActorSystem.start('Root');
// сам актор выполнен в виде класса, у которого есть контруктор. В некоторых фреймворках его наследует от класса актор, но мы не наследовали, он просто наследует интерфейс(но так как в js нет интерфейсво, то Тимур написал так что у актора есть конструктор и когда актор стартует то конструктор должен выполниться)

ActorSystem.register(
  class Root {
    constructor() {
      console.log('Start actor: Root');
      ActorSystem.start('Monitoring');
      ActorSystem.start('Renderer');
      ActorSystem.start('Mailer', 3);
    }

    // когда на актор приходит сообщения - будет исполняться асинхронный метод message

    // Наш корневой актор просто запускает другие и не кому никакя смс не отправляет

    async message() {}

    // когда мы скажем актору завершиться - у него вызовится метод exit
    // так как у нас фция асинхронная то мы через await можем вызвать сигнал остановки тем акторам которым Root стартовал
    // в нашем случае рут стартовал Monitoring, Renderer и аж три раза Mailer, то-есть пока один отправляет мы можем взять другой и дать ему задачу тоже отправлять. Когда мы будем пересыалть сообщения из одно актора к другому, то какой из эти трёх Мейлеров будет использоваться ? часть мелйеров может быть занята, а из тех что свободны мы берём по очереди, таким образом мы имеем очередь мейлеров из которых мы по одному забираем и как только какой-то освобождается то в конец этой очереди его и отдаём, то-есть мейлеры ротируется и нагрузка между ними будет равномерно расспределяться
    // Потом ниже в примере мы стопает акторы, важна так же последовательность в которой мы их стартуем и стопаем

    async exit() {
      await ActorSystem.stop('Monitoring');
      await ActorSystem.stop('Renderer');
      await ActorSystem.stop('Mailer');
      console.log('Stop actor: Root');
    }
  }
);
