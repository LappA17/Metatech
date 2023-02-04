/*
    1) IDEF1x - диаграма, где сущности связанные линиями, и если в конце линии булка значит many, а если ничего то one
    Если линия сплошная то not null, если пунктирная то nullable

Пример сплошной not null
Entity   ___.  OneToMany (not null)
Entity   ___   OneToOne (not null)
Entity   .___. ManyToMany (not null)

Пример пунктирной nullable
Entity   _ _ _ .    OneToMany (nullable)
Entity   _ _ _      OneToOne (nullable)
Entity   . _ _ _ .  ManyToMany (nullable)

nullable - это поле, которое в той таблице где подставлена жирная точка(в нашем случае .) может быть nullable. Поле в которой находится связь представлена в таблице . а если таких . две - то ни в одной таблице нет поля по которому происходит связь, а два поля находятся в Третей таблице через которую происходит связь !

    2) ERD (IDEF1x)

                    Person (и от него пунктирная линия без точек к User, те это _ _ _ OneToOne (nullable))

    Group   .___.   User    .___    City

                    Session (и от User к Session сплошная линия с точкой в конце то-есть это ___. OneToMany, один Юзер - много Сессий)

    3) ERD (IDEF1x): classification or type
    Такой тип связи используется очень редко. Её применяют когда одна сущность может быть одним из Объектов, те Person может быть и Customer, Worker или Supplier НО одновремено не может всеми ими быть

                                    Person
        
    Customer(линия к Person)    Worker(линия к Person)  Supplier(линия к Person)

    3) Example
                                                        Person(person_id(PK), name(AK))
                                                   пунктирная линия между Person и User           От City идет линия с треугольником в конце к User
    Group(groud_id(PK), name(AK))  GroupUser(group_id(FK), user_id(FK)  (PK))   User(person_id(PK, FK), login(AK))  City(city_id(PK), name(AK))
        От Group идет линия линия с треугольником  к GroupUser        От User идет линия с треугольником в конце к GroupUser и к Session
                                                                                Session(session_id(PK), person_id(FK), token(AK))

    Появилась доп таблице GroupUser которая содержит groud_id из таблицы group и user_id из таблицы User, оба они являются Foreign Key, но так же есть PrimaryKey который включае в себя два поля(оба из них)

    4) Table: SystemUser мы называем таблицу SystemUser потому что в некоторых СУБД слово User - это ключевое слово и им нельзя назвать

    CREATE TABLE SystemUser (
        id          serial,
        login       varchar(64) NOT NULL,
        password    varchar(64) NOT NULL,
        fullname    varchar(256)
    )

    ALTER TABLE SystemUser
        ADD CONSTRAINT pkSystemUser PRIMARY KEY (Id);
    
    CREATE UNIQUE INDEX akSystemUserLogin
        ON SystemUser (Login);


    5) Group User

    CREATE TABLE GroupUser (
        GroudId     integer NOT NULL,
        UserId      integer NOT NULL
    )

    ALTER TABLE GroupUser ADD CONSTRAINT pkGroupUser PRIMARY KEY (GroupId, UserId);

    ALTER TABLE GroupUser ADD CONSTRAINT fkGroupUserGroupId FOREIGN KEY (GroupId) REFERENCES SystemGroup (Id) ON DELETE CASCADE;
    у нас здесь GroupId ссылается на поле в таблице SystemGroup и там это поле называется Id и мы говорим что он ON DELETE CASCADE - это значит что он в родительской таблице если кто-то будет удалтяь, то у нас каскадно удалится сразу и в GroupUser всех пользователей у которых GroudId  равен тому Id в SystemGroup которого удалили

    ALTER TABLE GroupUser ADD CONSTRAINT fkGroupUserUserId FOREIGN KEY (UserId) REFERENCES SystemGroup (Id) ON DELETE CASCADE;

    Здесь уже GroupId который ссылается на таблице SystemGroup

    Мы делаем имя этому CONSTRAINT в нашем примере это fkGroupUserGroupId и fkGroupUserUserId, то-есть мы добавляет сначало что это FOREIGN KEY, потом на какую таблицу и потом поле в этой таблице, что бы потом можно было по именни таблицы и именни поля точно установить как у нас называется этот CONSTRAINT, что бы уже автоматичсески добавлять или удалять ключи, индексы, таблица, констреинты и всё такое

    В этом примере у нас два поля, но три индекса: два FOREIGN KEY которые смотря на юзера и его Групу и один PRIMARY KEY


    5) Table Session

    CREATE TABLE Session (
        Id      serial, тип serial - это тот же самый integer, который сам инкрементируется каждый раз
        UserId  intefer NOT NULL, integer - целое число
        Token   varchar(64) NOT NULL, varchar - это строчка определенной длины переданая в ()
        Ip      varchar(45) NOT NULL,
        Data    text     это строчка которая может быть очень длинной(сотни мб или даже гигабайт)
    )

    ALTER TABLE Session 
        ADD CONSTRAINT pkSession PRIMARY KEY (Id);

    CREATE UNIQUE INDEX akSession ON Session (Token);
    
    ALTER TABLE Session ADD CONSTRAINT fkSessionUserId FOREIGN KEY (UserId) REFERENCES Session (Id) ON DELETE CASCADE;

    Здесь у нас есть связка по UserId - у нас есть пользователь и к нему несколько сессий

    У нас здесь есть еще Уникальный ключ по Токену, так как это сессия то у нас есть Id Сессии и есть Токен Сессии и Токен Сессии является альтернативным ключом по-этоу он так и называется akSession где ak - alternative key ! 
    Таким образом мы можем искать сессию как и по Токену так и по Айди ! 
    Это сделано что бы не отдавать пользователю в браузер его Айди в Сессии и не начал искать по айди его Сессии
    Так же если бы мы в будущем писали SELECT * FROM Session WHERE Token = и тут название токена то это настоящий геморой, потому что проще написать SELECT * FROM Session WHERE Token = индекс Токена 


    6) Table SystemGroup

    CREATE TABLE SystemGroup (
        Id      serial,
        Name    varchar(64) NOT NULL
    )

    ALTER TABLE SystemGroup ADD CONSTRAINT pkSystemGroup PRIMARY KEY (Id);

    CREATE UNIQUE INDEX akSystemGroupName ON SystemGroup (Name);

    То-есть SystemUser связан с SystemGroup через один ко многим
*/
