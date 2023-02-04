'use strict';

const { Pool } = require('pg');

//можно было сделать просто connection, но connection нам почти никогда не будет нужен, по-этому нужно делать именно pool connection
//мы делаем pool connection для того что бы переиспользованные конкшены хранились в пуле
//мы в ручную может задать большое кство коннекшенов с помощью пулов, но если сразу на прямую за коннектимся то на сколько я понял заблокируем всем
//остальным работу с бд
const pool = new Pool({
  host: '127.0.0.1',
  port: 5432,
  database: 'application',
  user: 'marcus',
  password: 'marcus',
});

//для теста мы сразу попробуем считать с таблицы pg_tables(которая идет в постгресе по дефолту) имена всех таблиц потому что они здесь хранятся
const fields = ['schemaname', 'tablename', 'tableowner'].join(', ');
//$1 значит что в массива параметро tableowner будет идти под нулевым индексом(те первый аргумент) и это будет marcus
//те мы посмотрим все таблицы которые принадлежат пользователю marcus
const sql = `SELECT ${fields} FROM pg_tables WHERE tableowner = $1`;
pool.query(sql, ['marcus'], (err, res) => {
  if (err) {
    throw err;
  }
  console.dir({ res });
  console.table(res.fields);
  console.table(res.rows);
  pool.end(); //если мы не напишем pool.end то даже после того как закончится выполнения js наш коннекшен будет жить
});

/* Нам вернется экземпляр класса Result который был выполнен драйверами Postgres
  { res:
     Rsult {
        command: 'SELECT'
        и так далее
     }
  }

  Token   varchar(64) NOT NULL, - 64 это мы указываем длину

  Такой подход не достаточно удобный, так синтаксис грамосткий 

*/
