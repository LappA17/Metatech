'use strict';

const pg = require('pg');
const config = require('./config.service');

const pool = new pg.Pool(config.poolDB);

module.exports = table => ({
	//Благодаря этим методам новосозданным query, read, create и тд мы можем скрыть sql опператоры !!!
	//но по большому счету абстрогировать sql полностью из доменной области не получится !
	//это единственное из деталей реализации которая полностью не расстается с доменной моделью
	//потому что нам приходится очень завязывать на особености субд
	query(sql, args) {
		return pool.query(sql, args);
	},

	read(id, fields = ['*']) {
		const names = fields.join(', ');
		const sql = `SELECT ${names} FROM ${table}`;
		if (!id) return pool.query(sql);
		return pool.query(`${sql} WHERE id = $1`, [id]);
	},

	async create({ ...record }) {
		const keys = Object.keys(record);
		const nums = new Array(keys.length);
		const data = new Array(keys.length);
		let i = 0;
		for (const key of keys) {
			data[i] = record[key];
			nums[i] = `$${++i}`;
		}
		const fields = '"' + keys.join('", "') + '"';
		const params = nums.join(', ');
		const sql = `INSERT INTO "${table}" (${fields}) VALUES (${params})`;
		return pool.query(sql, data);
	},

	async update(id, { ...record }) {
		const keys = Object.keys(record);
		const updates = new Array(keys.length);
		const data = new Array(keys.length);
		let i = 0;
		for (const key of keys) {
			data[i] = record[key];
			updates[i] = `${key} = $${++i}`;
		}
		const delta = updates.join(', ');
		const sql = `UPDATE ${table} SET ${delta} WHERE id = $${++i}`;
		data.push(id);
		return pool.query(sql, data);
	},

	delete(id) {
		const sql = `DELETE FROM ${table} WHERE id = $1`;
		return pool.query(sql, [id]);
	},
});
