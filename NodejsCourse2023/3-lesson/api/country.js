const country = db('country');

({
	read(id) {
		console.log({ db });
		return country.read(id);
	},

	find(mask) {
		const sql = 'SELECT * from country where name like $1';
		//как мы обращаемся к базе ?
		//у нас теперь есть индификатор country а у него уже есть query
		//а country к нам пришел выше их db('country');
		//а в библиотеку db он попал через const pg = require('pg');
		return country.query(sql, [mask]);
	},
});
