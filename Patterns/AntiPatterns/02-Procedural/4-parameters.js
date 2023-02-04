'use strict';

// Antipattern: Too many parameters
// Antipattern: Pass-through parameters
// У нас есть очень много аргументов в фции + когда один и тот же набор аргументов - на сквозь передается и много раз из фции в фцию передается
{
  const validatePerson = (name, city, birth, dynasty, school) => {
    // Так типы проверять нельзя !!! Нужно либо использовать ТС, либо какой-то свой синитаксис придумать
    if (name.length < 3) return false;
    if (!city) return false;
    if (Number.isNaN(Date.parse(birth))) return false;
    if (dynasty.length < 5) return false;
    if (dynasty === school) return false;
    return true;
  };

  // фабричная фция buildPerson возвращает объект одинаковой все формы
  const buildPerson = (name, city, birth, dynasty, school) => {
    const date = new Date(birth);
    return { name, city, birth: date, dynasty, school };
  };

  const serializePerson = ({ name, city, birth, dynasty, school }) => {
    const date = birth.toISOString();
    return `${name} [${dynasty}] from ${city} (${date}) ${school} school`;
  };

  const registerPerson = (name, city, birth, dynasty, school) => {
    const valid = validatePerson(name, city, birth, dynasty, school); // видишь мы всю пачку аргументов передали еще раз уже в фцию validatePerson
    if (!valid) throw new Error('Emperor is invalid');
    const person = buildPerson(name, city, birth, dynasty, school); // Опять вся эта пачка передается в buildPerson
    const data = serializePerson(person); // опять вся пачка идет
    console.log(data);
  };

  registerPerson('Marcus Aurelius', 'Rome', '212-04-26', 'Nerva-Antonine', 'Stoicism');
}

// Solution
{
  const validatePerson = ({ name, city, birth, dynasty, school }) => {
    if (name.length < 3) return false;
    if (!city) return false;
    if (Number.isNaN(Date.parse(birth))) return false;
    if (dynasty.length < 5) return false;
    if (dynasty === school) return false;
    return true;
  };

  const serializePerson = ({ name, city, birth, dynasty, school }) => {
    const date = new Date(birth).toISOString();
    return `${name} [${dynasty}] from ${city} (${date}) ${school} school`;
  };

  const registerPerson = (person) => {
    const valid = validatePerson(person);
    if (!valid) throw new Error('Emperor is invalid');
    const data = serializePerson(person);
    console.log(data);
  };

  // Аргументы уже передаются в виде Объекта
  registerPerson({
    name: 'Marcus Aurelius',
    city: 'Rome',
    birth: '212-04-26',
    dynasty: 'Nerva-Antonine',
    school: 'Stoicism',
  });
}
