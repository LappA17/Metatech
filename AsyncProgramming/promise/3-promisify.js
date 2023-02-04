'use strict';

const promisify =
	fn =>
	(...args) =>
		new Promise((resolve, reject) => {
			args.push((err, result) => {
				if (err) reject(err);
				else resolve(result);
			});
			fn(...args);
		});

const fs = require('node:fs');

const readFile1 = promisify(fs.readFile); //так мы превратили в фцию которая возвращает Промисы

readFile1('file1.txt', 'utf8')
	.then(data => {
		console.log(data.toString());
		return readFile1('file2.txt', 'utf8');
	})
	.then(data => {
		console.log(data.toString());
		return readFile1('file3.txt', 'utf8');
	})
	.then(data => {
		console.log(data.toString());
	})
	.catch(err => {
		console.log(err);
	});

//если мы пишем не в Ноде, а в ДжаваСкрипте то у нас нет готового promisify и нам прийдет его писать руками как в примере выше(и он будет не такой хороший)
//но в Ноде он уже есть готовый в util.promisify
const util = require('node:util');

const readFile2 = util.promisify(fs.readFile);

readFile2('file1.txt', 'utf8')
	.then(data => {
		console.log(data.toString());
		return readFile2('file2.txt', 'utf8');
	})
	.then(data => {
		console.log(data.toString());
		return readFile2('file3.txt', 'utf8');
	})
	.then(data => {
		console.log(data.toString());
	})
	.catch(err => {
		console.log(err);
	});

/*
        promisify - мы в эту функцию на вход передаём функцию с контрактом fn, дальше ее кто-то вызываем с какими-то аргументами (...args), главное что в эти аргументы никто не пердаёт коллбек последним(то-есть все аргументы кроме коллбека) и из этой фции мы вызываем Промис и нам нужно его резолвить или реджектить и для того что бы это сделать нам нужно вызвать эту функцию fn(...args); c аргументами и что бы к ней добавить коллбек, мы в args.push добавляем свою Лямбду, те мы сами генерируем коллбек и с этого коллбека уже будет делать резолв или реджект

        Text in File1
        Text in File1
        Text in File2
        Text in File2
        Text in File3
        Text in File3
        У нас две цеопчки с промсифаем кастомным и с Ноды(readFile1, readfile2) и сначало выполнился then из readFile1 потом из readfile2 и даже не смотря на то что readfile2 у нас стоял вторым, но исполнялись они паралельно, но сами цепочки исполнялись последовательно, то-есть сначала then с file1 потом с fil2 и тд
    */
