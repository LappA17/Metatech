'use strict';

class Rect {
  toString() {
    return `[${this.x}, ${this.y}, ${this.width}, ${this.height}]`;
  }
}
//p1.__proto__ = Rect.prototype; // вместо setPrototypeOf мы иногда можем увидеть вот такую странную запись. То-есть когда мы уже сделали экземпляр какого-то объекта, у него есть уже 4 свойства, это объект который был создан без какого-то класса или прототипа и уже после того как он сздан - его можно связать с каким-то прототипом. Так как мы объявляли class Rect(те как класс) то у него есть .prototype те под капотом всё на прототипа работает. И тоже самое можно сделать через p1.__proto__ = Rect.prototype; Таким образом мы понмиаем что __proto__ - это у нас служебное поле которое может быть у объектов и если вдруг у объекта есть это поле, то когда мы вызываем у объекта методе к примеру .toString() то оно смотрет на это поле __proto__ то оно читает на какой прототип это поле ссылается, а у нас это Rect.prototype; и у Rect этот метод есть, таким образом по цепочки прототипов искать поля или методы через у предков !!
const p1 = { x: 10, y: 20, width: 50, height: 50 };
Object.setPrototypeOf(p1, Rect.prototype);
//p1.__proto__ = Rect.prototype;

console.log(p1);
console.log(p1.toString());
console.log(`${p1}`);
