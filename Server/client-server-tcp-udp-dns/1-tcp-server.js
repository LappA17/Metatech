'use strict';

const net = require('node:net');

const onData = data => {
  console.log('📨:', data);
};

const server = net
  .createServer(socket => {
    console.dir(socket.address());
    socket.setNoDelay(true); //означает что мы отключаем Буфферизацию и сокет сразу будет формирвоать пакеты как только мы туда что-то пишем
    socket.write('💗'); //мы пишем utf8 юникодный символ
    socket.on('data', onData); //потому что человек с того конца нам тоже что-то может отписать
    socket.on('error', err => {
      //если мы пропишем к примеру socket.unref(); на клиенте то нужно нам здесь обработать ошибку
      console.log('Socket error', err);
    });
  })
  .listen(2000); //вторым аргументом можно передать ip(host)

//что бы сервер не валился на ошибку
server.on('error', err => {
  console.log('Server error', err);
});

/* Callback который мы передаём в createServer - это listener, те он может вызваться не один раз по достижению какого-то асинхронного результата, а каждый раз когда к нам кто-то будет подкоючаться по TCP протоколу и будет создаваться экзепляр клиентскго сокета и будет приходить в нашу лямбду, но туда можно и не только лямбду передавать
 */
