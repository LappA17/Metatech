'use strict';

const fetch = require('./6-fetch.js');

const baseUrl = 'http://localhost:3000';

const promises = [fetch(baseUrl + '/person'), fetch(baseUrl + '/'), fetch(baseUrl + '/city')];

Promise.race(promises)
	.then(values => {
		console.log(values);
	})
	.catch(err => {
		console.log(err);
	});
// нам зарезолвится первый Промис из всех, а остальные будут потеряны, только один самый первый попадёт в then
