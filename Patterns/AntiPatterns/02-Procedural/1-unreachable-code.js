'use strict';

// Antipattern: Unreachable code
// linter detectable
{
  const isValid = (name) => {
    return true;
  };

  console.log(isValid('Marcus Aurelius'));
}

// Antipattern: Unreachable code
// run-time or analytic
{
  const isValid = (name) => {
    if (!name) return false;
    if (name.length === 0) return false;
    if (name.includes(' ')) return false;
    if (name[0] === ' ') return false; // unreachable, потому что строчка выше уже это проверяет
    return true;
  };

  console.log(isValid('Marcus Aurelius'));
}
