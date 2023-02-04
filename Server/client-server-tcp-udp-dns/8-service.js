'use strict';

const dns = require('node:dns');

dns.lookupService('192.30.253.113', 443, (err, host, service) => {
  if (err) throw err;
  console.log({ host, service });
});

/*
192.30.253.113 айпи гитхаба(или гугла уже не помнит тимур)
нам вернется название host и service(у гитхаба это https)
443 -  это стандартный порт для https протокола
гитхаб кодирует в имени хоста айпишник - это частое дело для облачных сервисов
*/
