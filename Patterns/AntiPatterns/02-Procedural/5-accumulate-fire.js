'use strict';

// Antipattern: Accumulate and fire - накопить в каком-то контексте и вызвать
// Что переменные прям в глобал пишутся, а не замыкаются где-то в Объекта !!!
// Это может приводить к РейсКондишенем, когда в одной фции поменялись значения, а мы в другой фции об этом не знаем

const name = 'Marcus Aurelius';
const city = 'Rome';
const birth = '212-04-26';
const dynasty = 'Nerva-Antonine';
const school = 'Stoicism';
registerPerson();

function registerPerson() {
  const date = new Date(birth);
  const person = { name, city, birth: date, dynasty, school };
  console.log({ person });
}
