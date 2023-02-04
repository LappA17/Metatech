'use strict';

// Мы можем добавлять методы объекту через прототипных подход

// прототипы принято называть с большой буквой
// это у нас конструктор прототипа
function Point(x, y) {
  this.x = x;
  this.y = y;
}

// мы объявляем нашему Point статический метод from

Point.from = function (obj) {
  const { x, y } = obj;
  return new Point(x, y);
};

// а здесь уже НЕ статический метод, а метод который будет наследоваться у Объекта и этот метод move будет у каждого экземпляра Point

Point.prototype.move = function (x, y) {
  this.x += x;
  this.y += y;
};

Point.prototype.toString = function () {
  return `[${this.x}, ${this.y}]`;
};

console.log('function prototype:', function () {}.prototype); // смотрим есть ли у функции прототип(а он есть и это будет пустой объект {})
console.log('lambda prototype:', (() => {}).prototype); // и есть ли прототип у лямбды(а у нее прототипа нет и мы получим undefined)

// у Point.prototype мы примешали .move , но move - это тоже функция объявленая через function и у неё тоже есть свой прототип

console.log('Point prototype:', Point.prototype); // здесь будет два метода move и toString и они будут лежать отдельно от полей ! То-есть если мы выводим в консоль console.log(p1); то получим Point { x: 5, y: 30 }
console.log('move prototype:', Point.prototype.move.prototype);

// метод from у экземпляра new Point, в нашем случае это p1, НЕ будет, потому что метод from есть у самого класса так как это статический метод, если мы напишем new Point().from то там будет метод, а у экземплялра p1 будет только move и toString !!!

const p1 = new Point(10, 20);
p1.move(-5, 10);

console.log(p1);
console.log(p1.toString());
console.log(p1 + '');
