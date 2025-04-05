const express = require('express');
const router = express.Router();
const peliculaController = require('../Controller/peliculasController.js')
const {query, param, validationResult} = require('express-validator');
const { error } = require('winston');

const validarConsulta = [
    query('id').optional().isInt().withMessage('El ID debe ser un número entero'),
    (req,res,next) => {
        const errores = validationResult(req);
        if(!errores.isEmpty()){
            const error = new Error('Error de validación');
            error.status = 400;
            error.details = errores.array();
            return next(error);
        }
        next();
    }
]

router.get('/', validarConsulta, peliculaController.consultarCatalogo);

router.delete('/:id', peliculaController.eliminarPelicula);

module.exports.router=router;