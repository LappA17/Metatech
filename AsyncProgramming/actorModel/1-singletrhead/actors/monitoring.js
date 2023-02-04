'use strict';

const ActorSystem = require('../system');
const http = require('node:http');

const URL = 'http://localhost:8000/';
const INTERVAL = 2000;

// когда мы стартуем процесс который будет заниматься мониторингом, то мы здесь будем мониторить url и на этом url должно быть какое-то апи(те мы проверяем есть ли у нас вообще такой сервер, есть ли там вообще такой порт по которому можно подключиться, если можно то отдаст ли он нам статускод 200). То-есть на этом этапе нам важно что бы этот url отдавал нам что-то без ошибки - это делает актор Мониторинг. Этот актор когда узнаёт о том что сервис перестал быть доступен(или отдаёт ошибку или вообще не может открыть сокет на этот сервис), то он тогда запоминает предыдущее состояние и ждёт пока это состояние поменяется
// у нас здесь есть интервал в 2 секунды const INTERVAL = 2000; так же у нас есть url который мы будем тестоировать(туда можно хоть гугл передать на то будет ли он поднят или упадёт)

ActorSystem.register(
  class Monitoring {
    constructor() {
      console.log('Start actor: Monitoring'); // выводим в консоль что актор стартовал
      this.prevSuccess = true; // предпологаем что предыдущее состояние у актора было успешное
      // тут мы навешиваем таймер, который будет осуществлять попытки getа нашего url
      this.timer = setInterval(() => {
        this.attempt(URL);
      }, INTERVAL);
    }

    // метод attempt умеет делать http.get и потом проверять, если статускод = 200 то всё хорошо
    // потом эти данные отправляются в виде структуры данных this.notify({ url, success, status: res.statusCode }); то-есть мы отправляем урл, флаг успшено или неуспешно и статусКод

    attempt(url) {
      http
        .get(url, (res) => {
          const success = res.statusCode === 200;
          this.notify({ url, success, status: res.statusCode });
        })
        .on('error', (error) => {
          // сюда отправляется ошибка сокета и отправляем ошибку которую сгенерировал сокет error.message
          this.notify({ url, success: false, status: error.message });
        });
    }

    notify({ url, success, status }) {
      // если предыдущее состояние не равно новому состоянию - значит что-то изменилось(сервер либо упал либо поднялся)
      if (this.prevSuccess !== success) {
        // мы сохраняем в предыдущее состояние наше нынешние
        this.prevSuccess = success;
        // и отправляем информацию о то что нужно отрендерить письмо на другой актор(на Renderer) и отправляем url, success и статус, а сам актор продолжить жить, то-есть этот актор был занят, а тут он освободится и в него смогут приходить новые задачи(но в нашем случае актор Мониторинг новых задач НЕ принимает, потому что он сам является генератором задач)
        ActorSystem.send('Renderer', { url, success, status });
      }
    }

    // так как наш актор Мониторинга сам генерирует задачи, а не принимает их, то если кто-то попробует отправить сообщение в наш аткор Мониторинга, то он его просто потеряет
    // Таким образом получается что если к примеру 10 акторов в памяти где-то работают и они могут друг-другу что-то говорить и если половину из них пропадёт, то остальные из них не попадают, а просто не будут получать сообщения от тех которые упали, либо же будут сами генерировать(как наш на таймере и разсылает), но тогда эти сообщения уже никто не слушает. По-этому наше приложение должно либо перезапускать их, либо просто сразу запускать не одну копию, а несколько копий акторов что бы хоть какой-то из них мог получить сообщение

    async message() {}

    async exit() {
      clearInterval(this.timer);
      console.log('Stop actor: Monitoring');
    }
  }
);

// Теперь мы поняли как работает актор Мониторинг - он отправляет сообщение на актор Renderer