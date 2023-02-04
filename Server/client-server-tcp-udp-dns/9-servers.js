'use strict';

const dns = require('node:dns');

const servers = dns.getServers();
console.log({ servers });

/*
    { servers: [ '8.8.8.8' ] }, '8.8.8.8' - это гугловский днс сервер, если перед ним будет другой то он будет брать тот что раньше в массиве
    Мы получаем список наших днс серверов
*/
