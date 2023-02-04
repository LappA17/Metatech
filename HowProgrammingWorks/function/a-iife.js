'use strict';

// Immediately-invoked function expression

(function f1() {
  console.log('f1');
})();

(function () {
  console.log('anonymous');
})();

(() => {
  console.log('lambda');
})();

// после того как появились блок функции ниже { } то функции iffe стали уже не нужны, потому что раньше мы не могли создавать контексты при помощи { }

{
  console.log('block');
}
