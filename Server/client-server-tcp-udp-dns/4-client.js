'use strict';

const net = require('node:net');

const socket = new net.Socket();

//будет нам и на экарн выводить сообщение и писать его в сокет - это удобно что бы можно было его отлаживать
const send = message => {
  console.log('Client >', message);
  socket.write(message);
};

//когда с сервера приходит
socket.on('data', data => {
  console.log('Server >', data.toString(), data);
});

socket.on('drain', () => {
  console.log('Event: 🤷');
});

//когда сервер заканчивает соединение
socket.on('end', () => {
  console.log('Event: 🏁');
  console.dir({
    bytesRead: socket.bytesRead,
    bytesWritten: socket.bytesWritten,
  });
});

socket.on('error', err => {
  console.log('Event: 💩');
  console.log(err);
});

socket.on('timeout', () => {
  console.log('Event: ⌛');
});

//то что отработает на коннекте
socket.on('connect', () => {
  send('💋');
  send('💋');
  send('💋');
});

//сначала откроется соединение, то-есть код ниже, и уже только потом отработает тот socket.on('connect' что выше
socket.connect({
  port: 2000,
  host: '127.0.0.1',
});
