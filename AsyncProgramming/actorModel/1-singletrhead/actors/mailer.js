'use strict';

const ActorSystem = require('../system');
const nodemailer = require('nodemailer');
const auth = require('../config');

const FROM = 'nodeua.com@gmail.com'; // задаём с какого емейла будут приходить сообщения

ActorSystem.register(
  class Mailer {
    constructor() {
      console.log('Start actor: Mailer');
      // здесь в контрукторе происходит инициализация актора, он создаём себе транспорт и говори что хочет отпрвалять почту через gmail и ему нужна логин и пароль, которые будут лежать в объекте auth
      this.transport = nodemailer.createTransport({
        service: 'gmail',
        auth,
      });
    }

    // Дальше месседжы могут приходит на наш актор Mailer
    // все что приходит в месседж { to, subject, message } все кладется в один объект - mail, туда добавляется еще FROM
    // и дальше мы вызываем transport.sendMail, который нам вернет или ошибку которую мы залогируем или инфу что все норм
    // и в этот Актор Mailer смс только приходят, но он никому больше ничего не отправляет(только внаружу куда-то отправил в почту и всё)

    async message({ to, subject, message }) {
      const mail = { from: FROM, to, subject, text: message };
      this.transport.sendMail(mail, (error, data) => {
        if (error) console.log(error);
        else console.log(`Email sent: ${data.response}`);
      });
    }

    // при выходе из этого актора мы должны разрушить этот транспорт this.transport.close(); - то-есть есть такие акторы которые при выходе могут делать какие-то финализационные действия типа сбрасывание кеша, отписки и тд

    async exit() {
      this.transport.close();
      console.log('Stop actor: Mailer');
    }
  }
);
