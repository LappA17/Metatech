// Здесь у нас пример как у нас во-вне может быть описан какая-то сущность(типа address: 'Address' из прошлого примера)
// она здесь тоже описанна метасхемой и у нас здесь account пользователя
// значит контрактами мы можем описывать вот такие вот структуру данных, потом передавать через апи и из базы читать(или из файлов) или через интеграцию с другими системами, из шины читать и проверять Контрактами

// главное что мы можем на стыке систем, там где даже ТайпСкрипт в рантайме нам не поможет проверить типы

({
  login: { type: 'string', unique: true },
  password: 'string',
  blocked: { type: 'boolean', default: false },
  company: 'Company',
  fullName: {
    given: '?string',
    middle: '?string',
    surname: '?string',
  },
  addresses: { many: 'Address' },
});
