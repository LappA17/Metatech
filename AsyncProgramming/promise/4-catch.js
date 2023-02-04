'use strict';

const fs = require('node:fs');

// то-есть в Ноде уже есть промисифицированная возможность readFile
const readTextFile = filename => fs.promises.readFile(filename, 'utf8');

readTextFile('file1-.txt')
	//у метода then может быть не только один аргумент коллбек фция, а есть еще одна фция куда мы передали reason когда случилась Ошибка
	//то-есть мы вместо catch можем обработать ошибку на втрой аргумент then - это абсолютно индитично
	.then(
		data => {
			console.dir({ file1: data });
			return readTextFile('file2.txt');
		},
		reason => {
			console.log('Cannot read file1.txt --- A');
			console.log(reason);
		}
	)
	.catch(reason => {
		console.log('Cannot read file1.txt --- B');
		console.log(reason);
	})
	.then(data => {
		console.dir({ file2: data });
		return readTextFile('file3.txt');
	})
	.catch(reason => {
		console.log('Cannot read file2.txt');
		console.log(reason);
	})
	.then(data => {
		console.dir({ file3: data });
	})
	.catch(reason => {
		console.log('Cannot read file');
		console.log(reason);
	});

/*
    Если мы закомментируем reason в первом then и предпоследний catch с Cannot read file2.txt то получим следующий ответ
    Cannot read file1.txt --- B
    [Error: ENOENT: no such file or directory, open 'file1-.txt'] {
    errno: -2,
    code: 'ENOENT',
    syscall: 'open',
    path: 'file1-.txt'
    }
    { file2: undefined }
    { file3: 'Text in File3' }
    То-есть мы получили ошибку Cannot read file
    [Error: ENOENT: no such file or directory, open 'file1-.txt'] а это структура которая содержит код ошибки
    Наш последний catch не знает в каком месте случилась ошибка, она могла случится во всех трех then(потому что мы закомментировали остальные catch и reason)
    Но наш annot read file из последнего catch совпадает с сообщением ошибки
    и из этого console.log(reason); ризона мы можем прочитать на какой цепочке промисов случилась ошибка

    Теперь мы расскоментируем catch с file2
    Cannot read file2.txt
    [Error: ENOENT: no such file or directory, open 'file1-.txt'] {
    errno: -2,
    code: 'ENOENT',
    syscall: 'open',
    path: 'file1-.txt'
    }
    { file3: undefined }
    Мы получили ошибку с Cannot read file2.txt хотя у нас вообще первый файл только не правильно прочитался
    Но мы видим что до последнего catch обработка не дошла, а сработал catch с файл2

    Если расскоментируем все кетчи и второй аргумент в then то получим
    Cannot read file1.txt --- A
    [Error: ENOENT: no such file or directory, open 'file1-.txt'] {
    errno: -2,
    code: 'ENOENT',
    syscall: 'open',
    path: 'file1-.txt'
    }
    { file2: undefined }
    { file3: 'Text in File3' }

    КАКОЙ ВЫВОД - ЧТО ПОСЛЕ КАЖДОГО then ЛУЧШЕ ПИСАТЬ catch ЧТО БЫ ТОЧНО ПОНЯТЬ ГДЕ ОШИБКА !
    ЕСЛИ МЫ ПРОПУСТИМ catch ТО В БОЛЕЕ НИЖНИЙ catch СВАЛЯТСЯ ОШИБКИ ИЗ ВСЕГО КОДА
*/
