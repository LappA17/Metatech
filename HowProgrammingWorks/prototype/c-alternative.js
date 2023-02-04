'use strict';

function Rect(x, y, width, height) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  // метод примешивается внутри конструктора. Или к примеру мы можем написать if (условие) и создавать ли этот метод в конструкторе или нет. Таким образом мы понимаем что ПРототипный способ наследование - мощнее чем классовый, потому что мы можем динамически у объектов то один метод то другой менять в зависимости что передали в конструктор для примера !!!
  this.toString = function () {
    return `[${this.x}, ${this.y}, ${this.width}, ${this.height}]`;
  };
}

const p1 = new Rect(10, 20, 50, 50);

console.log(p1);
console.log(p1.toString());
console.log(`${p1}`);
