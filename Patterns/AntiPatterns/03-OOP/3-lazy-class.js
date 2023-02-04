'use strict';

// Antipattern: Lazy Class
// похож на Дед-код - те код исполняется но ничего полезного не несет

class PersonName {
  constructor(name) {
    this.name = name;
  }
}

class PersonBirth {
  constructor(birth) {
    this.birth = new Date(birth);
  }
}

class Person {
  constructor(name, birth) {
    this.name = new PersonName(name);
    this.birth = new PersonBirth(birth);
  }
}

// Usage

const person = new Person('Marcus Aurelius', '121-04-26');
console.dir({ person });
