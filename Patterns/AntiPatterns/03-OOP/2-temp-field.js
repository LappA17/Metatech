'use strict';

// Antipattern: Temporary field
// Antipattern: Handle object as instances and hashes at the same time
// Antipattern: Use fields instead of arguments
// Мы с объектами и с экземплярами классами очень часто поступаем как с коллекциями, то-есть мы захотели - добавили поле, захотели - удалили поле, можем добавлять временные поля или в каком-то месте накопили информацию и потом вызвали метод как в этом примере, мы вместо того что бы передать name и birth аргументами в parseAge - мы делаем ах аргументами класса
// Хоть нам JS позволяет делать примиси(к примеру к нам пришел объект и мы в нем можем что-то поменять, дополнить, заменить), то нам все равно нужно выбрать 1) хотим ли мы использовать класс как инстенс объетка(экземпляр класса) или 2) использовать как коллекцию(кешировать к примеру) !!!
// Просто удалять и добавлять поля - это плохо, плохо сказывается и на производительности и код становится не читаемым

class Person {
  constructor(name, birth) {
    this.name = name;
    this.birth = birth;
    this.parseAge();
  }

  parseAge() {
    const difference = new Date() - new Date(this.birth);
    this.age = Math.floor(difference / 31536000000);
    delete this.birth;
  }
}

// Usage

const person = new Person('Marcus Aurelius', '121-04-26');
console.dir({ person });
