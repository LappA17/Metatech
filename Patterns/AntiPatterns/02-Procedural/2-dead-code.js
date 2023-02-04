'use strict';

// Antipattern: Dead code
// массив parts нигде не используется + else бесполезный потому что unshift в начала, хотя если длин ноль и мы сделаем пуш то он и так в начале добавится
{
  const isValid = (name) => {
    const parts = name.split(' ');

    if (parts.length > 0) parts.push('Last');
    else parts.unshift('First');
    return true;
  };

  console.log(isValid('Marcus Aurelius'));
}
