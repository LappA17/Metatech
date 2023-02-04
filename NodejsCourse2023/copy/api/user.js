//таким образом мы из бизнес логики ничего не экспортируем или импортируем
//во многих местах мы сразу пишем вот таким вот образом db('users').create({ login, password: passwordHash });
//то-есть у нас куда-то пропал sql стейтмент где был написан инсёрт инто юзерс
({
	read(id) {
		return db('users').read(id, ['id', 'login']);
	},

	async create({ login, password }) {
		const passwordHash = await common.hash(password);
		return db('users').create({ login, password: passwordHash });
	},

	async update(id, { login, password }) {
		const passwordHash = await common.hash(password);
		return db('users').update(id, { login, password: passwordHash });
	},

	delete(id) {
		return db('users').delete(id);
	},

	find(mask) {
		const sql = 'SELECT login from users where login like $1';
		return db('users').query(sql, [mask]);
	},
});
