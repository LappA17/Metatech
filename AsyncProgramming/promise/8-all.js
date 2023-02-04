'use strict';

const fetch = require('./6-fetch.js');

const baseUrl = 'http://localhost:3000';

//каждый fetch который мы кладем внутрь массива запоминает url(который мы запросили) и возвращает Promise
//те у нас будет массив из трех промисов
const promises = [fetch(baseUrl + '/person'), fetch(baseUrl + '/'), fetch(baseUrl + '/city')];

//до-этого Промисы не исполнялись
//они начнут свое исполнение в Promise.all и исполнятся будут ПАРАЛЕЛЬНО !
//и только после того как все промисы перейдёи в зарезолвенное состояние(те либо фулфилд либо реджектед) то только тогда случится then
//если хоть один сделает ошибку то попадёт в catch
Promise.all(promises)
	.then(values => {
		console.log(values);
	})
	.catch(err => {
		console.log(err);
	});
