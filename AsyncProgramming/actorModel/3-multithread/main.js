'use strict';

// В этом примере у нас процесс один, но внтури процесса несколько нитей
// весь код остался таким же - только мы поменяли транспорты на Воркер Треды

// Когда мы переходили от однопоточного к многопоточному исполнению, то у нас код самих акторов никак не поменялся(всё что в папке actors осталось как прежде). У нас поменялась реализация системы, которая занимается обменамы сообщениями

const ActorSystem = require('./system.js');

const EXIT_NORMAL = 1000;
const EXIT_ABNORMAL = 5000;

ActorSystem.start('Root');

process.on('SIGINT', () => {
  console.log('');
  ActorSystem.stop('Root');
  setTimeout(() => {
    console.log('Graceful shutdown');
    process.exit(0);
  }, EXIT_NORMAL);
  setTimeout(() => {
    console.log('Abnormal termination');
    process.exit(1);
  }, EXIT_ABNORMAL);
});
