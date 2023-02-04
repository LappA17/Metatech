'use strict';

const dns = require('node:dns');

dns.resolve('how.programming.works', (err, data) => {
  if (err) {
    //когда dns сервер не хочет нам отвечать на dns запросы
    if (err.code === 'ECONNREFUSED') {
      //то мы говорим что нет интернет соединения потому что мы не можем соединиться с нашим dns сервером
      console.log('No internet connection');
    } else {
      console.log('Web is dead');
    }
  }
  console.log({ data });
});

dns.resolveAny('google.com', (err, data) => {
  if (err) throw err;
  console.log({ data });
});

/* DNS - если мы пишем какие-то сетевые службы, то нам нужно резолвить айпишники или хостнеймы, приобразовывать их то-есть узнавать инфу от DNS по-этому в Ноде есть либа dns, и кстати tcp и utp к этой библиотеки обращаются потому что когда мы коннектимся мы можем выдать какой-то hostname типа 'how.porgramming.works' и оно нам к айпишнику уже само приобразует

{ data: [ '15.197.142.173', '3.33.152.147' ] } сам айпишник
{
  data: [
    { address: '216.58.209.14', ttl: 300, type: 'A' },
    { address: '2a00:1450:401b:808::200e', ttl: 300, type: 'AAAA' },
    { exchange: 'smtp.google.com', priority: 10, type: 'MX' },
    { value: 'ns4.google.com', type: 'NS' },
    { value: 'ns3.google.com', type: 'NS' },
    { value: 'ns2.google.com', type: 'NS' },
    { value: 'ns1.google.com', type: 'NS' },
    { entries: [Array], type: 'TXT' },
    { entries: [Array], type: 'TXT' },
    { entries: [Array], type: 'TXT' },
    { entries: [Array], type: 'TXT' },
    { entries: [Array], type: 'TXT' },
    { entries: [Array], type: 'TXT' },
    { entries: [Array], type: 'TXT' },
    { entries: [Array], type: 'TXT' },
    { entries: [Array], type: 'TXT' },
    { entries: [Array], type: 'TXT' },
    { entries: [Array], type: 'TXT' },
    { entries: [Array], type: 'TXT' },
    {
      nsname: 'ns1.google.com', это name сервака с которого google нам отдал апишник
      hostmaster: 'dns-admin.google.com',
      serial: 489786024,
      refresh: 900,
      retry: 900,
      expire: 1800,
      minttl: 60,
      type: 'SOA'
    },
    { critical: 0, issue: 'pki.goog', type: 'CAA' }
  ]
}

Важно понимать что resolve и resolveAny могут отработать в любом порядке, то-есть не смотря на то что resolve стоит первый в коде то к нам может вернуться ответ первее от resolveAny, потому что мы не знаем какой раньше отработает и вернется из очереди

MX - почтовые сервера, NX - нейм сервера
*/
