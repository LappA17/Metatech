'use strict';

const f1 = (...args) => {
  console.log(args);
};

f1(1, 2, 3);

const f2 = (...args) => {
  args.forEach((arg) => {
    const type = typeof arg; // вынесли в переменную typeof что typeof вызывался один раз а не два
    console.log('Type: ' + type);
    if (type === 'object') {
      console.log('Value: ' + JSON.stringify(arg));
    } else {
      console.log('Value: ' + arg);
    }
  });
};

f2(1, 'Marcus', { field: 'value' });
