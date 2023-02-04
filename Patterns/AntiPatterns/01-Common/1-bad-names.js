'use strict';

// Antipattern: Short identifiers(коротки наиминованния)
{
  const n = 'Marcus Aurelius';
}

// Antipattern: Long identifiers(длинные наиминованния)
{
  const romanEmperorAndOutstandingThinker = 'Marcus Aurelius';
}

// Antipattern: Same name but different meaning
// мы переменным можем давать одинаковые именна в разных контекстах, но с разными значениями
// те мы можем попутать две переменные
{
  const name = 'Marcus Aurelius';
  if (name) {
    const name = './config.js';
    console.dir({ name });
  }
}

// Antipattern: Same meaning but different naming
// одинаковое имя но разные значения fileName и file, правильно было бы назвать configFile и backupConfigFile
{
  const fileName = './config.js';
  if (!fileName) {
    const file = './backup/config.js';
    if (!file) {
      const filePath = '../config.js';
      console.dir({ filePath });
    }
  }
}

// Antipattern: Inconsistent names
// неконсистентное наиминованние, то-есть у нас есть три префикса set, assign, define которое де-факто значат одно и тоже и правильно было бы уже все методы называть с одним префиксом
{
  const api = {
    setPort: () => {},
    assignAddress: () => {},
    definePath: () => {},
  };
  console.dir({ api });
}

// Antipattern: Non descriptive names
// непонятно что за handler и что за link. Кажется что линк - это какой-то линк, а это фция, а handler наоборот передаем как аргумент в линк, хотя казалось что handler это фция
{
  class ApplicationController {
    constructor(link) {
      this.link = link;
    }

    execute(handler) {
      this.link(handler);
    }
  }
}
