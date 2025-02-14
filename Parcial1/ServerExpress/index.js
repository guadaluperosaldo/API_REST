const express = require('express');
const xmlparser = require('express-xml-bodyparser');
const multer = require('multer');
const path = require('path');
const app = express();
const port=3000;

const folder = path.join(__dirname+'/artchivosrec/');
const upload = multer({dest:folder});

//Middleware incorporado en express
app.use(express.json());
app.use(express.text());
app.use(xmlparser());
app.use(upload.single('archivo'));

app.use('/',(req,res,next)=>{
    console.log("Petición al server");
    next();
});
app.use('/',(req,res,next)=>{
    console.log("2da función Middleware");
    next();
});

app.get('/alumno', (req, res) => {
    console.log(req.query);
    res.sendFile(__dirname + '/public/index.html');
});

app.post('/sistemas/control', (req, res) => {
    console.log(req.body);
    res.send('Hello World!');
});

app.patch('/maestros/:control', (req, res) => {
    console.log(req.body);
    res.send('Hello World!');
});

app.post('/prefectos', (req, res) => {
    //console.log(req.body);
    //res.send('Hello World!');
    console.log(`Se recibio el archivo: ${req.file.originalname}`); 
    console.log(req.body); 
    console.log('Se recibio el formulario:'+JSON.stringify(req.body)); 
    res.json(req.body); 
});

app.use((req, res) => {
    res.status(404).send("Error 404");
});

app.listen(port, () => {
    console.log(`Servidor express escuchando en http://localhost:${port}`);
});