var http = require('http');

let server = http.createServer(function (req, res) {
    //res.writeHead(200, {'Content-Type': 'text/html'});
    res.writeHead(200, {'Access-Control-Allow-Origin': '*'});
    res.end('Hello Word!');
})

server.listen(3000, () => {
    console.log("Servidor HTTP corriendo en pto 3000");
});
