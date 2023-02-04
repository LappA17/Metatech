'use strict';

const flag = false;

label1: {
  console.log(1);
  label2: {
    console.log(2);
    break label1;
    // console.log(3) претьер тоже удаляет
  }
  // console.log(4); претьер удаляет этот консоль лог, так как он никогда не состоится
}
console.log(5);
