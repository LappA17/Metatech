'use strict';

// Все что происходит в этой папке 1-singlethread будет происходить внутри одного процесса и одного потока

const ActorSystem = require('./system.js');

// может быть такое что за одну секунду акторы закончатся не успеют и они там подвиснут и мы им даём 5 секунд и если за 5 секунд они не повыходили то мы длеаем process.exit

const EXIT_NORMAL = 1000;
const EXIT_ABNORMAL = 5000;

// сразу стартует корневой актор

ActorSystem.start('Root');

// потом приложение слушает SIGINT - это интерапт приложения, когда кто-то нажимает contol + C , то сюда приходит это событие и наша точка входу(корневой файл main.js) он стопает актор Root вот здесь ActorSystem.stop('Root'); , а актор Root по цепочке может запустить еще несколько акторов, то-есть акторы имеют такую древовидную структуру - один может запустить несколько и каждый из этих нескольких может запустить еще следующие и тд, таким образом у нас построется дерево и они могут обмениваться родительский с дочерним или по именни обращаться друг к другу

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

/* Если мы сейчас запустим наше приложение(и укажем правильный лог и пароль от почты), то нам на почту прийдет смс, если мы положим сервер то сразу же прийдет смс что сервер положился и ошибка, а если подними то сразу же прийдет смс на почту что сервер поднялся и после того как мы стартуем сервер мы в консоли получаем следующие

Ruslan@MacBook-Pro 1-singletrhead % node main.js 
Start actor: Root
Start actor: Monitoring
Start actor: Renderer
Start actor: Mailer
Start actor: Mailer
Start actor: Mailer
^C
Stop actor: Monitoring
Stop actor: Renderer
Stop actor: Mailer
Stop actor: Mailer
Stop actor: Mailer
Stop actor: Root
Error: Invalid login: 535-5.7.8 Username and Password not accepted. Learn more at
535 5.7.8  https://support.google.com/mail/?p=BadCredentials u2-20020ac258c2000000b004b5766f48d8sm1821670lfo.19 - gsmtp
    at SMTPConnection._formatError (/Users/Ruslan/Desktop/Work/timur-shemsedinov/AsyncProgramming/actorModel/1-singletrhead/node_modules/nodemailer/lib/smtp-connection/index.js:790:19)
    at SMTPConnection._actionAUTHComplete (/Users/Ruslan/Desktop/Work/timur-shemsedinov/AsyncProgramming/actorModel/1-singletrhead/node_modules/nodemailer/lib/smtp-connection/index.js:1542:34)
    at SMTPConnection.<anonymous> (/Users/Ruslan/Desktop/Work/timur-shemsedinov/AsyncProgramming/actorModel/1-singletrhead/node_modules/nodemailer/lib/smtp-connection/index.js:546:26)
    at SMTPConnection._processResponse (/Users/Ruslan/Desktop/Work/timur-shemsedinov/AsyncProgramming/actorModel/1-singletrhead/node_modules/nodemailer/lib/smtp-connection/index.js:953:20)
    at SMTPConnection._onData (/Users/Ruslan/Desktop/Work/timur-shemsedinov/AsyncProgramming/actorModel/1-singletrhead/node_modules/nodemailer/lib/smtp-connection/index.js:755:14)
    at TLSSocket.SMTPConnection._onSocketData (/Users/Ruslan/Desktop/Work/timur-shemsedinov/AsyncProgramming/actorModel/1-singletrhead/node_modules/nodemailer/lib/smtp-connection/index.js:193:44)
    at TLSSocket.emit (node:events:513:28)
    at addChunk (node:internal/streams/readable:315:12)
    at readableAddChunk (node:internal/streams/readable:289:9)
    at TLSSocket.Readable.push (node:internal/streams/readable:228:10) {
  code: 'EAUTH',
  response: '535-5.7.8 Username and Password not accepted. Learn more at\n' +
    '535 5.7.8  https://support.google.com/mail/?p=BadCredentials u2-20020ac258c2000000b004b5766f48d8sm1821670lfo.19 - gsmtp',
  responseCode: 535,
  command: 'AUTH PLAIN'
}
Graceful shutdown

То-есть наши акторы в одноим порядке стартвоали и в противоположном стопнулись
Сообщение Graceful shutdown - даёт понять что мы не просто оборвали процесс не дав закончится нашим акторам, а мы им отослали сообщение что бы они закончились и мы в этом случае полождали когда все акторы вышли мы получили строчку Graceful shutdown
 */
