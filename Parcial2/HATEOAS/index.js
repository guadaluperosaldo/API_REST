const path = require("path");
const express = require("express");
const routerCatalogo = require("./Routers/routerPeliculas.js");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const winston = require("winston");

const app = express();
let port = process.env.PORT;

// Configuración del logger
const logger = winston.createLogger({
    level: "error",
    format: winston.format.json(),
    transports: [new winston.transports.File({ filename: __dirname + "/logs/error.log" })],
});

// Configuración del motor de vistas Pug
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

app.use(express.json());  
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
