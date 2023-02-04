'use strict';

const hash = () => {
  const data = {}; // точно так же создаем data что бы хранить значение
  // в defineProperty первым аргументом передаем тот объект у которого нужно создать поле, потом само поле и дальше
  Object.defineProperty(data, 'add', {
    enumerable: false, // это поле не будет перечислять при помощи цикла for
    // значение этого метода add будет равно той функции которую мы передаём в value
    value(key, value) {
      data[key] = value; // мы записываем в data какое-то значение по какому-то ключу
      return data; // отдаем сам объект
      // Таким образом у data будут появляться свойства, а одно свойство у data - наш add, пишется через defineProperty
    },
  });
  return data;
};

// Usage

console.dir(hash().add('name', 'Marcus').add('city', 'Roma').add('born', 121));
