'use strict';

const dns = require('node:dns');

const options = {
  all: true,
  family: 6, //что бы ipv6 нам всгеда отдавал
  hints: dns.ADDRCONFIG | dns.V4MAPPED,
};

dns.lookup('github.com', options, (err, addresses) => {
  if (err) throw err;
  console.dir({ addresses });
});

/*
{ addresses: [ { address: '::ffff:140.82.121.4', family: 6 } ] }
но у одного и того же хоста может быть и два айпишника
Если мы поставит в family: 4 то получим { addresses: [ { address: '140.82.121.4', family: 4 } ] }
то-есть без префикса ::ffff
*/
