'use strict';

// переписали логер с замыканий на прототипы

function Logger(kind) {
  this.color = Logger.colors[kind] || Logger.colors.info;
}

Logger.colors = {
  warning: '\x1b[1;33m',
  error: '\x1b[0;31m',
  info: '\x1b[1;37m',
};

Logger.prototype.log = function (s) {
  const date = new Date().toISOString();
  console.log(this.color + date + '\t' + s); // единственное что он цвет берёт из this потому что в function Logger через конструктор он был туда присвоен
};

// Usage

const warning = new Logger('warning');
const error = new Logger('error');
const debug = new Logger('debug');
const slow = new Logger('slow');

slow.log('I am slow logger');
warning.log('Hello');
error.log('World');
debug.log('Bye!');
