'use strict';

const { Pool } = require('pg');

const pool = new Pool({
  host: '127.0.0.1',
  port: 5432,
  database: 'application',
  user: 'marcus',
  password: 'marcus',
});
//если мы можем работать с асинк-евейтами то само собой сможем и с Промисами
const fields = ['schemaname', 'tablename', 'tableowner', 'hasindexes'];
const sql = 'SELECT ' + fields.join(', ') + ' FROM pg_catalog.pg_tables WHERE tableowner = $1';
pool
  .query(sql, ['marcus'])
  .then(res => {
    const { rows } = res;
    console.table(rows);
  })
  .catch(err => {
    console.log(err);
  })
  .finally(() => {
    pool.end();
  });

/*
  Если мы целеноправлено допустим ошибку, к примеру напишем вместо SELECT слово SELEC, то мы получим ошибку
  Нам прийдет Stack trase и тут будет:
  Connection.parseE - это бдует коннекшен к Базе Данных
  Socket - тот tcpшный сокет который открыли pgшные драйвера при подключение к БД
  Сокет обёрнут в Коннекшен и дальше всё это обернуто в pool и этот pool выдал нам уже Syntax Error 
*/
