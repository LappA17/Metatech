/* Cluster - это обёретка в округ child-proces, и он позволяет не просто форкать процессы и устанавливать между ними связь при помощи файловых потоков, но и передавать автоматически Хендлы, к примеру мы хотим написать сетевой сервер(к примеру http) и мы хотим что бы его запросы у нас обрабатывались в нескольких потоках
Кластер оборачивает всё что связанно с сетью что мы пишем createServer один раз в master процессе, а он это делает много раз в child-process  */