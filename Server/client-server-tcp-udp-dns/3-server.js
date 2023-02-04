'use strict';

const net = require('node:net');

const connection = socket => {
  console.dir({
    localAddress: socket.localAddress,
    localPort: socket.localPort,
    remoteAddress: socket.remoteAddress, //remote-удаленный
    remoteFamily: socket.remoteFamily, // ipv6 или ipv4 подключение
    remotePort: socket.remotePort,
    bufferSize: socket.bufferSize,
  });

  socket.write('💗');

  socket.on('data', data => {
    console.log('Event: 📨', data);
    console.log('Data:', data.toString());
  });

  socket.on('drain', () => {
    //drain - это когда через socket уже больше нечего качать
    console.log('Event: 🤷');
  });

  //этот отработает когда клиент уже отключился
  socket.on('end', () => {
    console.log('Event: 🏁');
    console.dir({
      bytesRead: socket.bytesRead, //сколько байтов было прочитанно
      bytesWritten: socket.bytesWritten, //сколько байтов было записанно
    });
  });

  socket.on('error', err => {
    console.log('Event: 💩');
    console.log(err);
  });

  socket.on('timeout', () => {
    console.log('Event: ⌛');
  });
};

const server = net.createServer(); //мы могли connection выше передать сюда аргументом

server.on('connection', connection);

server.listen(2000);

/* У нас remotePort: 39552 хотя serverPort у нас 2000, почему так происходит ? Потому что для tcp протокола у нас socket индифицируется хостом и портом и для того что бы клиент умел подключится к этому серверу, у него тоже индификатор и если серверные порты очень часто используются с малыми номермми то remoteПорты(которые у клиентоского соединение) то мы этот порт уже сами не задаём, его нам выберает Операционная системаа и необходим он как hadnle - это число индифицирующея сокет

    Теперь когда мы разорвём соединение и подключимся снова, то мы обратим внимание что в первый раз нам в data пришло 
    Data: 💋💋💋
    А во-второй раз 
    Data: 💋
    Data: 💋💋
    ПОТОМУ ЧТО TCP пакеты могут резаться и склеиваться как им захочется - это протокол потоковый по-этому как TCP/IP стеку удобней - так он и будет их объеденять или склеивать
    
*/
