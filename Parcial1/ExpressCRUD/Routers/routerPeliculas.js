const express = require('express');
const router = express.Router();
const peliculaController = require('../Controller/peliculasController.js')

router.get('/',peliculaController.consultarCatalogo);

router.delete('/:id', peliculaController.eliminarPelicula);

module.exports.router=router;