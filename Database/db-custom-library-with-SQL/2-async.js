'use strict';

const { Pool } = require('pg');

const pool = new Pool({
  host: '127.0.0.1',
  port: 5432,
  database: 'application',
  user: 'marcus',
  password: 'marcus',
});

//здесь мы делаем всё тоже самое что и в 1-test только через async await
(async () => {
  const fields = ['schemaname', 'tablename', 'tableowner'].join(', ');
  const sql = `SELECT ${fields} FROM pg_tables WHERE tableowner = $1`;
  const { rows } = await pool.query(sql, ['marcus']);
  console.table(rows);
  pool.end();
})();

/*
  Если мы просто пропишем `SELECT ${fields} FROM pg_tables` без доп параметров то мы получим все таблицы, у нас там будут их типы public, information_schema, pg_catalog так вот information_schema - это нискоуровневая системаня таблица , pg_catalog - это системная таблица принадлежащая pg_catalog , но вот именно public уже являются нашими таблицами
*/
