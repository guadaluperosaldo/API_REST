const path = require("path");
const express = require('express');
const routerCatalogo = require('./Routers/routerPeliculas.js');
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

let port=process.env.PORT;

const app = express();

app.use(express.json());  

app.use('/catalogo',routerCatalogo.router);

app.use((req,res)=>{
    res.status(404);
    res.send("Error 404");
})

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});
