'use strict';

// Как мы можем считывать поля

// Object/Hash
const person = {
  name: 'Marcus',
  city: 'Roma',
  born: 121,
};

console.log('Person name is: ' + person.name);
console.log('Person name is: ' + person['name']);

delete person.name;
console.dir({ person });

delete person['city'];
console.dir({ person });

// ниже будет такой же самый объект как выше person, только наш city будет объявлен по другому через get и set
// это приводит к тому что у нашего объекта появляется поле city, которое мы можем считать(те мы можем написать person2.city) и выполнится фция и то что эта фция вернёт и будет значением поля. И точно так же с set, если кто-то напишеь person2.city то выполнится console.log('Marcus remains in Roma');

// With getter
const person2 = {
  name: 'Marcus Aurelius',
  get city() {
    return 'Roma';
  },
  set city(value) {
    console.log('Marcus remains in Roma');
  },
};

person2.city = 'Kiev';

console.dir({ person2 });
/*
Marcus remains in Roma
{ person2: { name: 'Marcus Aurelius', city: [Getter/Setter] } }
Вместо city написан Getter/Setter те нам js говорит что поле есть но оно вычисляемое(те пока мы к нему обращаемся то значение есть а если нет то значения не видно)
*/
