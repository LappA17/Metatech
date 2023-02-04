/*
    Buffer позволяет работать с участками памяти которые не подлежат Гарбетч Коллекшенам

    Если строки у нас иммутабильные то к Буфферу мы можем обращаться как к типизированному массиву
    мы можем из любой позиции Буфера что-то пописать или почитать

    Мы можем Буфферы сравниваь, конктинировать и тд, у нас кучу есть методов для работы с ними Buffer.isBuffer(), Buffer.from() и тд

    Если нам приходит к примеру файл в 5мб, то мы можем сделать array и в него чанками записывать Буфферы и потом всё это законкатить в один большой Буффер, но сделаь один большой Буффер на 5мб будет быстрее и эффекивнее но иногда мы не знаем какой длины нам этот Буффер прилетит
*/
