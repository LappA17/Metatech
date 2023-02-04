'use strict';

// Antipattern: Spaghetti code
// - JMP, GOTO - это использовать невозможно потому что этих операторов у нас нет, Но примерно тоже самое можем написать на евентЕмиттерах, потому евентЕмиттеры позволяют практических из любой точки кода передать событие в нужную точку кода и там дальше передать управление
// - Callbacks - код построенный на вложенных коллбеках тоже можно назвать спагети кодом
// - Events
// - Promises

// Callbacks
{
  const invoke = (validate, fn, a, b, callback) => {
    const result = fn(validate, a, b); // мы в фцию fn передаём validate и а, b
    callback(null, result); // получаем результат и отправляем в коллбек, те это нагроможления фции в фцию, фции в фцию и код достаточно сложный в результате
  };

  const max = (validate, a, b) => {
    let valid = true;
    const conjunction = (err, res) => {
      valid = valid && res;
    };
    validate(a, conjunction);
    validate(b, conjunction);

    if (!valid) throw new TypeError('Unexpected parameter');

    return Math.max(a, b);
  };

  const isNumber = (value, callback) => {
    const valid = typeof value === 'number';
    callback(null, valid);
  };

  invoke(isNumber, max, 10, 20, (err, result) => {
    console.dir({ result });
  });
}

// Events
// Try to debug this code to find logical error
{
  const { EventEmitter } = require('node:events');

  // делаем три эвентэмиттера
  const incoming = new EventEmitter();
  const controller = new EventEmitter();
  const processing = new EventEmitter();

  const parameters = [];

  // обработчик который умеет возвращать значение и печатать его на экран
  incoming.on('return', (result) => {
    console.dir({ result });
  });

  // обработчик который умеет ловить событие макс, брать из него два аргумента и брать из него максимально значение и эмиттить событие return
  processing.on('max', (a, b) => {
    incoming.emit('return', Math.max(a, b));
  });

  // контроллер вешается на parameter, берет отсюда одно значение и пушится в array
  controller.on('parameter', (value) => {
    parameters.push(value);
  });

  // событие input, забирает данные из этого input, валидирует и эмити событие call, а если в data не строка то он считает что это параметр
  incoming.on('input', (data) => {
    if (typeof data === 'string') {
      controller.emit('call', data);
    } else {
      controller.emit('parameter', data);
    }
  });

  controller.on('call', (name) => {
    processing.emit(name, ...parameters);
  });

  // при помощи евентЭмиттеров мы смогли построить что-то вроде вызовов фции
  // сначала эмитааем сюда 10, потом 20 и потом max и потом вся эта машинерия на событиях понимает что 10 и 20 это параметры и их нужно передать max. То-есть можно просто было создать фцию max и сюда передать два аргумента, но у нас сплошные евентЭмиттеры и везде один что-то другому сует

  incoming.emit('input', 10);
  incoming.emit('input', 20);
  incoming.emit('input', 'max');
}
