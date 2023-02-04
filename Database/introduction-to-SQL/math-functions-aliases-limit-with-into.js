/*
    1) Methematical functions

    + addtion
    - substraction
    * multiplication
    / division
    % modulo (not include into ANSI SQL)

    ABS(x)
    SIGN(x)
    MOD(x, y)       вместо % можно фцию MOD поставить, тоже самое что x % y
    FLOOR(x)
    CEIL(x)
    POWER(x, y)
    ROUND(x)
    ROUND(x, d)
    SQRT(x)

    1.1 Example

    SELECT FirstName, round(SALARY) FROM Employee; тут можно написать round(SALARY) as и задать име колонке

    SELECT FirstName FROM Employee WHERE Age % 2 = 0;

    2) SQL Aliases

    SELECT Column1 AS Alias1 FROM TABLE;

    SELECT Column1 FROM Table AS Alias1;

    Иногда когда мы делаем join то у нас название колонок может пересекаться

    3) SELECT LIMIT and OFFSET

    SELECT <columns> FROM <table> WHERE <condition> LIMIT n OFFSET m;

    LIMIT - позволяет выбрать nое кство записей
    OFFSET - сдвинуться относительно начала выборки

    4) Comment in SQL

    1. Begin the comment with a slash and an asterisk (/*). Proceed with the text of the comment. This text can span multiple lines. ... то-есть точно так же как и в js /* и тем же самим закрыли
    2. Begin the comment with -- (two hyphens). Proceed with the text of the comment. This text cannot extend to a new line.

    5) With опператор

    WITH Regions AS (SELECT Region, SUM(Amount) AS Total FROM Orders GROUP BY Region) SELECT Region, Product, SUM(Quantity), AS Units, FROM Orders WHERE Region IN (SELECT Region FROM Regions) GROUP BY Region, Product;

    Внутри SELECT используется вложенный SELECT и он в скобочках IN (SELECT Region FROM Regions) и вот откуда должен взяться этот вложенный здесь SELECT ? 
    Допустим у нас нет вообще таблицы Region, но у нас до SELECT стоит WITH и мы взяли из таблицы с названием ORDERS взяли и выняли все Регионы и положили эти Региона как буд-то назвали их Regions те мы написали WITH REGIONS и теперь мы можем ссылаться на всё что вернёт SELECT те SELECT REGION, SUM(Amount) AS Total FROM ORDERS и вот резльтат всего этого SELECT будет внутри того SELECT который три последние строчки нашего запроса и всё это будет называться Regions и мы будем к нему по-этому имени обращаться. 
    Это можно было бы сделать вложенными запросами(один внутри другого написать)

    6) SELECT INTO

    SELECT * INTO ImportantTask FROM Task WHERE Priority = 'high';

    Сохранится в новую таблицу и эта таблица(её структура) возьмется из запроса
*/
