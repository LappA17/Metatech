'use strict';

const person = {
  name: 'Marcus',
  city: 'Roma',
  born: 121,
};

// Мы можем проверять есть ли какое-то поле внутри Объекта
if ('name' in person) {
  console.log('Person name is: ' + person.name);
}

for (const key in person) {
  const value = person[key]; // в квадрратных скобкаъ [] мы обращаемся как к асициативному массиве
  console.dir({ key, value });
}

// Variables to hash
const name = 'Marcus Aurelius';
const city = 'Rome';

{
  const person = { name, city }; // мы можем не писать два раза name: name, а просто name
  console.dir({ person });
}

// Dynamic field name
{
  const fieldName = 'city';
  const fieldValue = 'Roma';
  const person = {
    name: 'Marcus Aurelius',
    [fieldName]: fieldValue, // сюда подставить значение переменное fieldName, а это у нас city
  };
  console.dir({ person });
}

// Expression in field name
{
  const prefix = 'city';
  const person = {
    name: 'Marcus Aurelius',
    [prefix + 'Born']: 'Roma', // кроме этого в этих квадратных скобках вообще может что-то вычисляться
  };
  console.dir({ person });
}

// Function in field name
{
  const fn = (s) => s + 'Born';
  const person = {
    name: 'Marcus Aurelius',
    [fn('city')]: 'Roma', // и даже так может вычислятьсься, у нас в [] будет cityBorn
  };
  console.dir({ person });
}
