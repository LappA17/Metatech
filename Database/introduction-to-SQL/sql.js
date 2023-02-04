/*
    1) SELECT

    SELECT Id, Login, FullName
    From systemuser
    WHERE Login = 'marcus'

    SELECT может иметь несколько clause 
    clause - это когда после ключевого слова SELECT перечисляется поля(или выражение, те разные вызовы фций) через запятую что он будет выбирать
    FROM - мы указали какие таблицы входят в этот вывод
    WHERE - какие условия накладываются в таблицы входят в выборку
    само собой в WHERE clause у нас может быть сравнение одних полей одной таблицы с другими из другой

    SELECT [ALL|DISTINCT] column1[, column2]...
    FROM table1[, table2]...
    [WHERE <conditions>]
    [GROUP BY <columns>]
    [HAVING <conditions>]
    [ORDER BY <columns> [ASC|DESC]]

    В примере выше в [] мы обозначали поля которые могут пропускаться, то-есть ALL или DISTINCT могут быть а могут и нет
    [ASC|DESC] - по возростанию или по убыванию, ASC будет по дефолту

    2) Какие могут быть WHERE опператоры сравнения

    =
    >
    <
    >=
    <=
    != это неравно, его так же можно написать <>
    LIKE это сравнение по маски, LIKE всегд обрабатывает текстовые поля

    2.1) LIKE
    Мы с помощью LIKE можем обрабатывать различные виды регулярных выражений, только в sql это специальный синтаксис
    % - может заменять любую строчку или отсутствия строки
    SELECT Id, Fullname, Login FROM SystemUser WHERE Login LIKE 'Mar%' 
    таким образом мы выберем все записи из таблтцы SystemUser где поле Login начинается на эти три буквы Mar

    2.2) _
    SELECT Id, Fullname, Login FROM SystemUser WHERE Login LIKE 'Mar_us'
    _ заменяет одну букву и не может заменяться пустой строкой, то-есть _ это обязательно какая-то буква но не пустая строка


    3) Опператоры(DISTINCT | ALL | ANY и тд)

    SELECT DISTINCT FullName FROM SystemUser
    DISTINCT позволяет нам выбрать только те записи которые НЕ будут приводить к дублирвоанию колонок
    то-есть даже если у пользователя полностью совпадает FullName(к пример у нас будет два Васи Пупкина), но DISTINCT позволяет нам выбрать уникальное имя FullName и если будет несколько колонок то имя этих колоноко не должно повторяться

    SELECT Id, Login, FullName FROM SystemUser WHERE Id = ALL(SELECT UserId WHERE IP = '127.0.0.1')
    ALL - позволяет внутри в подзапросе написать какой-то вложенный SELECT который должен всегда быть true, то-есть позвоялет для всех записей которые попадают под вложенный SELECT
    из нашего примера - все пользователи у которых айдишник в таблице SystemUser соотвествует записям у которых Айпи будет 127.0.0.1

    ANY хотя бы ОДНА запись из вложеного SELECT должна удолитоврять этому условию
    SELECT Id, Login, FullName FROM SystemUser WHERE Id = ANY(SELECT UserId WHERE IP = '127.0.0.1')

    4) Aggregate Functions(агригатные функции)
    
    MIN самое меньше значение из выбранной колонки
    MAX
    SUM сума значений из выбранной колонки колонки
    AVG
    COUNT
    COUNT(*) вместо имени колонки в фцию мы можем передать * и мы узнаем кство записей всего в наборе данных. 
    Использовать SELECT COUNT(*) - очень плохая практика, лучше хранить отдельную таблицу и у нее поле где мы можем получить весь набор данных

    SELECT avg(Salary) FROM Employee; средняя зп по сотруднику
    SELECT avg(Salary) FROM Employee GROUP BY DEPARTMENT; средняя зарплата по отделу
    SELECT count(*) FROM Employee;

    4.1) GROUP BY clause 

    Агригатные фции могут использоваться с другими полями
    SELECT Item, sum(Price) FROM Goods GROUP BY Supplier; мы по каждому поставщику(Supplier) получим общую суму, а поле Item выведится вместе с этой суммой, те мы получим таблицу из двух колоночек где будет Item и сума для поставщика

    SELECT max(Salary), Departmanet FROM Employee GROUP BY DEPARTMENT; максимальная зарплата по каждому отделу, то-есть две колонки получатся где будет имя отдела и максимальная зарплата по этому отделу

    4.2) HAVING clause

    SELECT column1, SUM(column2) FROM <tables> GROUP BY columns HAVING <condition>; похож на WHERE запрос, те это условие которое будет нам отдавать все записи, которые в этом условие будут давать true. В GROUP BY будут попадать только те строчки для котороых этот condition будет в true, то оно в GROUP BY будет сумарироваться и в этой колоночки подсумируется

    SELECT Department, avg(Salary) FROM Employee GROUP BY DEPARTMENT HAVING avg(Salary) > 200; то-есть для каждого департа будет вычисляться средняя зарплата, но попадут в выборку только те департманты в которых средняя зарпалата будет больше 200, отделы у которых меньше 200 зп не попадут в нашу эту выборку

    4.3) ORDER BY clause

    SELECT column1, SUM(column2) FROM <tables> ORDER BY <columns> [ASC | DESC]; отсортируем результат в определенном порядке, если мы вообще никакой ORDER BY не напишем то СУБД нам выдаст данные в том порядке в котором мы вставляли их в тиблицу, но иногда он может вставит последнюю написанную запись в начало или в середи, те мы не можем гарантировать что записи будут в том порядке что мы их изначально написали

    SELECT Id, Department, Name, Salary FROM Info WHERE Department = 'Sales' ORDER BY Salary; мы берём отдел продаж и выводим их людей сортируя по зарплате(сначало с меньшей потом с большей но мы можем дописать DESC что бы наоборот)

    SELECT Id, Department, Name, Salary, Age FROM Info WHERE Department = 'Sales' ORDER BY Salary, Age DESC; берем данные из таблицы Info в которой отдел - это Sales и сортируем по зарплате по убыванию, но если у кого-то зарплата одинаковая то сортируем по возрасту !

    4.4) Combining conditions(объеденять условия)

    SELECT column1, SUM(column2) FROM <tables> WHERE <condition1> AND <condtion2>;

    SELECT Id, Name, Title, Salary FROM Info WHERE Title = 'Sales' OR (Title = 'Programmer' AND Salary >= 4500);

    4.5) WHERE..IN condition

    SELECT col1, SUM(col2) FROM <tables> WHERE col3 IN (<values>); мы можем перечислить множество значений, поставить в скобочки через запятую и если у нас какая-то колоночка(в нашем случае col3) будет принимать одно значение из множества то нам этот WHERE будет возвращать true
    это работает похожим образом как в js работает arrau.inlcudes(), то-есть col3 равно одному значению из множества
    так же мы можем переписать через OR, те col3 равно одному значению OR col3 равно другому и тд

    SELECT Id, Department, Salary FROM Employee WHERE Department IN ('Softwhere', 'QA'); отдел Softwhere(програмного обезпечения) или QA, то-есть либо такой отдел либо такой

    SELECT Id, Department, Salary FROM Employee WHERE Department = 'Softwhere' OR Department = 'QA'; тоже самое что выше только не так красиво

    4.6) WHERE..BETWEEN

    SELECT col1, SUM(col2) FROM <tables> WHERE col3 BETWEEN <value1> AND <value2>; мы можем написать col3 больше или равно value1 AND col3 меньше равно value2, но при помощи BETWEEN мы это пишем красивее, те BETWEEN позволяет нам выбрать все записи где значение col3 находится между value1 и value2

    SELECT Id, Age, LastName, Salart FROM Employees WHERE Age BETWEEN 30 AND 40;


    // CREATE, ALTER, DROP, ключи, индексы

    1) CREATE DATABASE

    CREATE DATABASE application_data;
    DROP DATABASE [IF EXISTS] application_data;

    Нужно привыкать писать sql а не в шеле, потому что так удобней и больше возможностей для проверок и тд ! 

    2) CREATE TABLE

    CREATE TABLE Employee (
        FirstName text,
        LastName text,
        Salary integer
    );
    DROP TABLE [IF EXISTS] Employee;

    Обычно таблица начинаются с поля id и потом уже какие-то данные

    Лучше всего на одну сущность предметной области делать одну таблицу

    3) ALTER TABLE 

    ALTER TABLE Employee ADD COLUMN [IF NOT EXIST] DateOfBirth date; так мы добавим колонку DateOfBirth в таблтцу Employee
    
    После того как таблица создана мы можем динамически менять её структуру не удаляя данные оттуда
    ALTER TABLE позволяет добавить колонку, индекс или еще что-то такое
    Колонка добавица в конец списка

    4) TABLE CONSTRAINTS

    CREATE TABLE Product (
        Name text,
        Price numeric CHECK (Price > 0)
    )

    В этом примере в поле Price кроме типа numeric добавляем к нему еще проверку что поле Price должно быть положительным числом больше 0

    5) NOT NULL

    CREATE TABLE Product (
        Name text NOT NULL,
        Price numeric NOT NULL CHECK (Price > 0)
    )

    NOT NULL явно говорит что по дефолту поле не может быть null, нам нужно хотя бы пустую строчку в Name записать
    желательно что бы все ключи, индексы и айди были NOT NULL

    6) UNIQUE FIELDS
    
    CREATE TABLE Product (
        Name text NOT NULL UNIQUE
        Price numeric NOT NULL CHECK (Price > 0)
    )
    
    Во всей таблице не может быть двух одинаковых значений в двух разных строчках
    Всегда нужно стараться объявлять схемы декларативно в Базе даных, то-есть не писать какие-то проверки Ифами а просто добавить поле UNIQUE

    7) Primary Key

    CREATE TABLE Product (
        Name text PRIMARY KEY,
        Price numeric NOT NULL CHECK (Price > 0)
    )

    Primary Key всегда идентифицирует уникальную запись в таблице, он всегда уникален
    Разница между Primary Key и UNIQUE в том что Primary Key еще создаёт там индекс !
    В данном примере CREATE TABLE создаёт таблицу с двумя полями index и check те в базе данных много разных сущностей которые связаны в один Product

    8) Foreign Key

    CREATE TABLE Product (
        Name text PRIMARY KEY,
        Price numeric NOT NULL CHECK (PRICE > 0)
        ProducerID REFERENCES Producer (ID)
    )

    Foreign Key это ссылки на другие таблицы
    REFERENCES внешник ключи мы определяем с помощью ключевого слова REFERENCES
    Поле ProducerID будет ссылаться на поле ID в таблице Producer

    9) DEFAULT VALUE

    CREATE TABLE Product (Price numeric DEFAULT 10)

    10) TABLE INDEX and UNIQUE INDEX

    CREATE INDEX ON Employee (LastName); создает индекс по полю LastName в таблице Employee НЕуникальный ключ, это значит что поиск по LastName ускорится, но можно будет вставлять несколько людей с одинаковым LastName
    CREATE UNIQUE INDEX ON Product (Name); точно так же создает индекс только уникальный

    Можно уникальный индексы делать отдельными крейтеми потому что тогда можно объвления этих ключей копировать отдельно от таблиц
    
    Индексы делают под разны случаи(есть деревья, хеш-таблицы и тд)
*/
