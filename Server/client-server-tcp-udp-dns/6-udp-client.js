'use strict';

const dgram = require('node:dgram');

const message = Buffer.from('Hello'); //создаем буффер из Hello
const client = dgram.createSocket('udp4'); //создаём udpшный сокет

//в этот сокет записываем наш Hello
client.send(message, 3000, 'localhost', err => {
  if (err) {
    client.close();
    throw err;
  }
});
