/*В net лежит всё что связанно с TCP и UTP протоколами
    Здесь так же есть createServer и в отличие от http сервера будет приходить не Реквест и Респонс а connection
   const server = net.createServer((socket) {
        ... some code 
        socket.end()
    }).error('error', (err) => throw err)
    
    server */
