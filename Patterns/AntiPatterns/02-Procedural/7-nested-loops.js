'use strict';

// Antipattern: Nested loops - Вложенные циклы
// Antipattern: Pyramid of doom
{
  const phones = [
    { name: 'Marcus', phone: '12345678' },
    { name: 'Kant', phone: '1234567' },
  ];

  const cities = [
    { name: 'Marcus', city: 'Roma' },
    { name: 'Kant', city: 'Kaliningrad' },
  ];

  const prefixes = [
    { name: 'Roma', prefix: '+3906' },
    { name: 'Kaliningrad', prefix: '+7401' },
  ];

  //некрасиво и нечитаемо !
  const getPhoneNumber = (name) => {
    for (const record1 of phones) {
      if (record1.name === name) {
        for (const record2 of cities) {
          if (record2.name === name) {
            for (const record3 of prefixes) {
              if (record3.name === record2.city) {
                return record3.prefix + record1.phone;
              }
            }
          }
        }
      }
    }
  };

  const callMarcus = getPhoneNumber('Marcus');
  console.dir({ callMarcus });
}

// Antipattern: Hidden loops
// скрытые циклы
{
  // во-первых уже все затащили в объект persons
  const persons = [
    { name: 'Marcus', phone: '12345678', city: 'Roma' },
    { name: 'Kant', phone: '1234567', city: 'Kaliningrad' },
  ];

  // теперь из Префикса мы не массив сделали, а справочник, мы по ключу теперь можем узнать значение и это будет работать чуть БЫСТРЕЕ ! Тем самым на не нужно будет как в предыдущим примере обходить весь массив циклом что бы найти !!
  const prefixes = {
    Roma: '+3906',
    Kaliningrad: '+7401',
  };

  const getPhoneNumber = (name) => {
    const person = persons.find((person) => person.name === name); // Красиво находим в массиве, но нам кажется что мы избавились от цикла, но внутри find всё равно цикл, более того мы замедлили потому что у нас на каждой итерации цикла будет вызываться фция сравнения person.name === name, те у нас не просто цикл, а в цикле еще и вызов фции
    const { phone, city } = person;
    const prefix = prefixes[city]; // из хеш-таблицы найдем по city. У объектов в js может быть две формы: динамическая и статическая, те у него поля добавляются и изменяются и если это динамически часто происходит, то js переводит объект в режим справочника - те в режим хеш-таблицы, но у нас это статическая форма - те только два поля задано и никогда не добавляется и не изменяется. Какие связи с этим могут быть оптимизации: наш js может понять что мы часто вызываем префикс city и у нас city будет чаще Roma или Kaliningrad и из-за этого оно может сразу находить где эти поля находятся в памяти, те тут может быть заменено на уровне байткода заменено и никакого поиска по хеш-таблице не будет происходить,а так же есть шанс что будет на for in замененно(это будет нискоуровневый цикл, уже не js). А если мы будем юзать Map и искать через get то у нас точно будет использоваться хеш-таблица, тогда точно по ключам вычисляться Хеш и по нему уже будет отдаваться значение !!!
    return prefix + phone;
  };

  const callMarcus = getPhoneNumber('Marcus');
  console.dir({ callMarcus });
}

// Solution
{
  // мы persons тоже сделали справочником(теперь это не массив, а справочник), у него есть тоже ключи и внутри у него дублируется информация, у него дублируется name и в этом ничего страшного нет, потому что чем больше информации в нашем случае(а иногда это нормально, потому что это не фциональная зависимость, а карилация некоторых вещей) и иногда мы можем при выделениее большего кства памяти и использование тяжеловесных структур данных облегчить по ним поиск и не нужно будет проходится по массиву методом find, а искать через persons[name], ровно так же мы могли бы использовать new Map и оно точно так же будет по хет-таблице искать!!!
  // То какими мы структурами данными опперируем - и определяет то какими алгоритмами мы будем запускать эти структуры данных !!
  const persons = {
    Marcus: { name: 'Marcus', phone: '12345678', city: 'Roma' },
    Kant: { name: 'Kant', phone: '1234567', city: 'Kaliningrad' },
  };

  const prefixes = {
    Roma: '+3906',
    Kaliningrad: '+7401',
  };

  const getPhoneNumber = (name) => {
    const person = persons[name]; // Обрати внимание что тимур не использует метод find, а использует [] что бы динамически найти. Это очень влияет на оптимизацию, так как не нужно проходится по целому массиву !!!
    const { phone, city } = person;
    const prefix = prefixes[city];
    return prefix + phone;
  };

  const callMarcus = getPhoneNumber('Marcus');
  console.dir({ callMarcus });
}
