// Внутрь бизнес-логики(ключ method) полностью защищенна от внешенго мира, и он не должен if проверять какие данные к нему пришли, он точно знает что name - это стринг, age - это намбер и больше 16, а address - это экзепляр адресса, который описан снаруже по-этому нам приходит 'Address', но мы бы могли сразу написать там address : { city: 'string', street: '?string', building: '?number' } , но в нашем примере нам просто приходит ссылка на Address а оно там уже в схеме где-то описанно

// server: application/api/crm/createAccount.js

({
  parameters: {
    name: 'string',
    age: { type: 'number', min: 16 },
    address: 'Address',
  },

  method: async ({ name, age, address }) => {
    const processed = await db.select('Account', { name });
    if (processed) return { exists: true, status: 'registered' };
    const cityId = await db.select('City', { name: address.city });
    const accountId = await db.insert('Account', { name, age, city });
    return { exists: true, status: 'inserted' };
  },

  returns: {
    exists: 'boolean',
    status: { enum: ['inserted', 'restricted', 'registered'] },
  },
});

// client

const res = await api.crm.createAccount({ name, age, address });
