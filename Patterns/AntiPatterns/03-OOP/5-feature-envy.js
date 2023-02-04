'use strict';

// Antipattern: Feature Envy
// Antipattern: High Coupling

const countries = {
  379: 'Vatican',
  380: 'Ukraine',
  381: 'Serbia',
};

const areas = {
  43: 'Vinnitsa',
  44: 'Kiev',
  62: 'Donetsk',
};

// Теперь у нас два класса Phone и Person

class Phone {
  constructor(s) {
    this.country = countries[s.substring(1, 4)];
    this.area = areas[s.substring(4, 6)];
    this.number = s.substring(6, 13);
  }

  static getCountryCode(name) {
    return Object.keys(countries).find((key) => countries[key] === name);
  }

  static getAreaCode(name) {
    return Object.keys(areas).find((key) => areas[key] === name);
  }
}

class Person {
  constructor(name, phoneNumber) {
    this.name = name;
    this.phone = new Phone(phoneNumber);
  }
  // Метод call() болеет антипаттерном Жадные Функции или Feature Envy, потому что мы в call постоянно обращаемся к полям чужого класса this.phone.country, this.phone.area, this.phone.number то-есть к собственным полям он не обращается, а только лазит к Phone и правильно было бы перенести этот метод call в class Phone !
  call() {
    const countryCode = Phone.getCountryCode(this.phone.country);
    const areaCode = Phone.getAreaCode(this.phone.area);
    const phone = this.phone.number;
    console.log(`ATDP ${countryCode}${areaCode}${phone}`);
  }
}

// Usage

const person = new Person('Marcus Aurelius', '+380441234567');
console.dir({ person });
person.call();
