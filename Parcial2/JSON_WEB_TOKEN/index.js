const path = require("path");
const fs = require('fs');
const express = require("express");
const routerCatalogo = require("./Routers/routerPeliculas.js");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const winston = require("winston");
const jsonwebtoken = require('jsonwebtoken');

const app = express();
let port = process.env.PORT;

app.use(express.json()); 

// Configuración del logger
const logger = winston.createLogger({
    level: "error",
    format: winston.format.json(),
    transports: [new winston.transports.File({ filename: __dirname + "/logs/error.log" })],
});

app.post('/login',function(req,res,next){
    let privada = fs.readFileSync(path.join(__dirname,'/llaves/privada.pem'), 'utf8')

    var token = jsonwebtoken.sign(req.body,privada,{algorithm:'RS256'});
    console.log(token);
    res.json(token);
})

app.get('/sistema', verificarToken,function(req,res,next){
    res.json({mensaje:"Acceso concedido a ruta sistema"})
}),

// Configuración del motor de vistas Pug
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

app.use("/catalogo", routerCatalogo.router);

// Middleware para manejar rutas no encontradas
app.use((req, res, next) => {
    let err = new Error("Ruta no encontrada");
    next(err);
});

// Middleware para manejo de errores
app.use((err, req, res, next) => {
    logger.error(err.message, { stack: err.stack });

    if(err.status === 400){
        return res.status(400).json({
            error: err.message,
            detalles: err.details || []
        });
    }
    
    res.status(500).json({ error: err.message });
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});

function verificarToken(req,res,next){
    console.log(req.headers.authorization);
    let publica = fs.readFileSync(path.join(__dirname,'/llaves/publica.pem'), 'utf8')
    if(typeof(req.headers.authorization)=='undefined')
    {
        res.json({Error: "Token no enviado"});
    }
    else
    {
        let token = req.headers.authorization.substring(7,req.headers.authorization.length);
        jsonwebtoken.verify(token, publica,function(err,decoded){
            if(err)
            {
                res.json({Error:"Acceso denegado a ruta sistema"});
            }
            else
            {
                next();
            }
        });
    }
}