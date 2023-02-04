'use strict';

// Этот сервер умеет отдавать статический html(const index = fs.readFileSync('./6-client.html');) и собственно в этом хтмл у нас cancelable Промисы буду лежать и умеет отдавать один ендпоинт на /person

const fs = require('node:fs');
const http = require('node:http');

const person = { name: 'MarcusAurelius' };
const index = fs.readFileSync('./6-client.html');

http
  .createServer((req, res) => {
    const { url } = req;
    if (url === '/person') {
      res.end(JSON.stringify(person));
    } else {
      res.end(index);
    }
  })
  .listen(8001);
