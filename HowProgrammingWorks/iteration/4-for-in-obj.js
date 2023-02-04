'use strict';

const hash = {
  first: 7,
  second: 10,
  third: 1,
  fourth: 5,
};

hash.fifth = 2;

Object.defineProperty(hash, 'newField', {
  enumerable: false, // если будет true то добавится новое поле newField с значением valueOfNewField
  value: 'valueOfNewField',
});

Object.prototype.inheritedProperty = 'inherited';

for (const key in hash) {
  const value = hash[key];
  console.log(key, '\t', typeof key, '\t', value, '\t', typeof value);
}

/*
first 	 string 	 7 	 number
second 	 string 	 10 	 number
third 	 string 	 1 	 number
fourth 	 string 	 5 	 number
fifth 	 string 	 2 	 number
inheritedProperty 	 string 	 inherited 	 string
*/
