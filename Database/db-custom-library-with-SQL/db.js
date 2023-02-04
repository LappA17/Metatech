'use strict';

//здесь драйвера
const { Pool } = require('pg');

//построитель запросов
//это объект в котором поля <= = >= и тд
const where = conditions => {
  let clause = '';
  const args = []; //мы все аргументы вытягиваем из conditions и запехнём их в один arr
  let i = 1;
  for (const key in conditions) {
    let value = conditions[key]; //берём по ключу там к примеру первый кондишен
    let condition; //сюда будем записывать этот кондишен
    if (typeof value === 'number') {
      condition = `${key} = $${i}`; //ключ равно доллар 1 допустим, это то что мы записали в кондишен
    } else if (typeof value === 'string') {
      if (value.startsWith('>=')) {
        condition = `${key} >= $${i}`;
        value = value.substring(2);
      } else if (value.startsWith('<=')) {
        condition = `${key} <= $${i}`;
        value = value.substring(2);
      } else if (value.startsWith('<>')) {
        // <> так принятно писать НЕРАВНО в sql
        condition = `${key} <> $${i}`;
        value = value.substring(2);
      } else if (value.startsWith('>')) {
        condition = `${key} > $${i}`;
        value = value.substring(1);
      } else if (value.startsWith('<')) {
        condition = `${key} < $${i}`;
        value = value.substring(1);
      } else if (value.includes('*') || value.includes('?')) {
        //в sql вместо * принято использовать % - это маска любой последовательности символом или пустой строки
        //а _ это тоже маска только одного символа но обязательно одного, то-есть нельзя пропускать
        //те мы реплейсаем все звездочки на процент и все ? на подчеркивания
        value = value.replace(/\*/g, '%').replace(/\?/g, '_');
        condition = `${key} LIKE $${i}`;
      } else {
        condition = `${key} = $${i}`;
      }
    }
    i++; //наращиваем индекс что бы для следующий иттерации был $2, $3 и тд
    args.push(value);
    //если clause была пустой строкой то мы берём confition который мы сформировали именно на этой иттерации
    //а если что то было то мы слепим старую clause с новым confition
    clause = clause ? `${clause} AND ${condition}` : condition;
  }
  return { clause, args }; //мы возвращаем уже розделенный массив аргументов в args, а clause - это строка sql в котором всё это уже есть
  /* если мы выведем args в консоль то получим arhs: ['marcus', 'public'] ,а clause: { 'tableowner = $1 AND schemaname = $2' }
  и они будут потом драйвером pg эскейпится */
};

const MODE_ROWS = 0;
const MODE_VALUE = 1;
const MODE_ROW = 2;
const MODE_COL = 3;
const MODE_COUNT = 4;

//здесь так же везде teturn this что бы мы могли через чейнинг прицеплять еще метод
class Cursor {
  //в конструкторе мы инициализируем все поля Курсора + инициализируем ссылка на database которую мы как this передали
  constructor(database, table) {
    this.database = database;
    this.table = table;
    this.cols = null;
    this.rows = null;
    this.rowCount = 0;
    this.ready = false;
    this.mode = MODE_ROWS;
    this.whereClause = undefined;
    this.columns = ['*']; //колонки по-умолчанию все
    this.args = [];
    this.orderBy = undefined;
  }

  resolve(result) {
    const { rows, fields, rowCount } = result;
    this.rows = rows;
    this.cols = fields;
    this.rowCount = rowCount;
  }

  where(conditions) {
    const { clause, args } = where(conditions);
    this.whereClause = clause;
    this.args = args;
    return this;
  }

  fields(list) {
    this.columns = list;
    return this;
  }

  //это value будет нужно если мы хотим исполнить SELECT из базы
  //ниже написал зачем нужны value, row, col
  value() {
    this.mode = MODE_VALUE;
    return this;
  }

  row() {
    this.mode = MODE_ROW;
    return this;
  }

  col(name) {
    this.mode = MODE_COL;
    this.columnName = name;
    return this;
  }

  count() {
    this.mode = MODE_COUNT;
    return this;
  }

  order(name) {
    this.orderBy = name;
    return this;
  }

  then(callback) {
    // TODO: store callback to pool
    const { mode, table, columns, args } = this;
    const { whereClause, orderBy, columnName } = this;
    const fields = columns.join(', ');
    let sql = `SELECT ${fields} FROM ${table}`;
    if (whereClause) sql += ` WHERE ${whereClause}`; //в whereClause будет обычная строка, но что бы это всё было безопасно то из этой строки все значения были выняты и они отправились в массив args, они были так выняты что бы никто не сделал sql injection, сам драйвер pg будет эскейпить все переданные аргументыв в этот массив args и если кто-то вставил в этот массив sql injection то будет все это дела за эскейпино и нам не нужно эскейпить все эти аргументы, а просто заменить их именна на $1, $2 и тд, а здесь этот массив args уже автоматически проэскейпился и всё будет безопасно
    if (orderBy) sql += ` ORDER BY ${orderBy}`; //мы байндиним наш новосозданный метод orderBy в sql опператор где мы отсортируем таблицу по параметру который в него приходит
    this.database.query(sql, args, (err, res) => {
      //наш метод resolve умеет из результата распихивать массив строк и массив колонок и кство записей который он получает из res и расспихивает их просто по свойствам нашего Курсора
      this.resolve(res);
      const { rows, cols } = this;
      if (mode === MODE_VALUE) {
        const col = cols[0];
        const row = rows[0];
        callback(row[col.name]); //мы читаем имя колонки из объекта row и всё это отдаём в коллбек
      } else if (mode === MODE_ROW) {
        callback(rows[0]);
      } else if (mode === MODE_COL) {
        const col = [];
        for (const row of rows) {
          col.push(row[columnName]);
        }
        callback(col);
      } else if (mode === MODE_COUNT) {
        callback(this.rowCount);
      } else {
        //MODE_ROWS
        callback(rows); //возвращем все строчки
      }
    });
    return this;
  }
}

class Database {
  constructor(config, logger) {
    //мы врапним pool и в Database запишем каким пулом мы пользуемся, с каким конфигом и логером
    this.pool = new Pool(config);
    this.config = config;
    this.logger = logger;
  }

  //values - массив аргументов
  //сам Курсор на pool ссылки не имеет, у него есть ссыла только на соотвествующий Database а именно new Cursor(this мы передаём this как Database, а у Database уже есть query и он таким образо будет ходить в базу
  query(sql, values, callback) {
    if (typeof values === 'function') {
      callback = values;
      values = [];
    }
    const startTime = new Date().getTime();
    /*Посел того как мы выведем в консоль sql мы получим SELECT schemaname, tablename, tableowner, hasindexes FROM pg_tables WHERE tableowner = $1 AND schemaname = $2 */
    console.log({ sql, values });
    this.pool.query(sql, values, (err, res) => {
      const endTime = new Date().getTime();
      const executionTime = endTime - startTime;
      console.log(`Execution time: ${executionTime}`);
      if (callback) callback(err, res);
    });
  }

  //принимает таблицу и сразу отправляет ее в Курсор, а Курсору нужна ссылка на БД, по-этому Database дает ему ссылку на самого себя первым аргументом в виде this и пробрасывает туда имя таблица которую мы хотим в курсор запихнуть
  select(table) {
    return new Cursor(this, table);
  }

  close() {
    this.pool.end();
  }
}

module.exports = {
  open: (config, logger) => new Database(config, logger),
};

/*
  В примере ниже выйдет value, но если мы хотим одну строчку вернуть то нужно вместо .value() передать .row() и в then уже вернёт row
  pg.select('pg_tables')
  .where({ tableowner: 'systemuser' })
  .value()
  .then(value => {
    console.table(value);
    pg.close();
  });
  Если нам нужно колонку передать то пишем вместо value() передаём col('tablename) и в then(array) уже выйдет array
*/
