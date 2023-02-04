'use strict';

const ActorSystem = require('../system');

ActorSystem.register(
  class Renderer {
    // Здесь мы в контрсукторе только говорим что актор стартовался
    constructor() {
      console.log('Start actor: Renderer');
    }

    // Этот актор уже умеет получать какие-то месседжы - они приходят от актора Мониторинга и он тут формирует письмо
    // мы в коде использовали библиотеку из НПМ(библиотеку nodemailer которая умеет отправлять, мы ее вызываем в const nodemailer = require('nodemailer'); в mailer.js)

    async message({ url, success, status }) {
      // берём емейл
      const to = 'nodeua.com@gmail.com';
      // формируем сообщние с информацией доступен или не доступен
      const msg = success ? 'is available again' : 'is not available';
      //берёт текущую дату
      const date = new Date().toUTCString();
      // форматируем ошибку
      const reason = (success ? 'Status code: ' : 'Error code: ') + status;
      // генерируем message и subject
      const message = `Resource ${url} ${msg} (${date})\n${reason}`;
      const subject = 'Server Monitoring';
      // и отправляет Актору Mailer который уже будет отправлять емейл
      ActorSystem.send('Mailer', { to, subject, message });
    }

    async exit() {
      console.log('Stop actor: Renderer');
    }
  }
);
