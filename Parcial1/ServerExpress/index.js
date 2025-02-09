const express = require('express');
const app = express();
const port=3000;

//Middleware incorporado en express
app.use(express.json());
app.use(express.text());

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

app.use((req, res) => {
    res.status(404).send("Error 404");
});

app.listen(port, () => {
    console.log(`Servidor express escuchando en http://localhost:${port}`);
});