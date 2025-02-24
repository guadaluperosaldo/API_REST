const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const mysql = require('mysql2');

//conexion a la base de datos
const conexion = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
});

//consulta catalogo de todas las peliculas y series vistas
function consultarCatalogo(req,res,next){

    let consulta = '';
    if(typeof(req.query.id)==='undefined') {consulta = 'SELECT * FROM peliculas_series'}
    else{consulta = 'SELECT * FROM peliculas_series WHERE id = ' + req.query.id}
        
    conexion.query(consulta,
        function(err,results,fields){
            if(err){res.json({Error:"Error en el servidor "});}
            if(results.length>0){
                res.json({resultado:results})
            }
            else{
                res.json({Error:"No encontrado"});
            }
        }
    )
    };

    module.exports.consultarCatalogo=consultarCatalogo;

    
function eliminarPelicula(req, res) {
    const { id } = req.params; 
    
    // Consulta SQL para eliminar el registro
    const sql = 'DELETE FROM peliculas_series WHERE id = ?';

    conexion.query(sql, [id], (err, result) => {
        if (err) {
            console.error("Error al eliminar la película:", err);
            return res.status(500).json({ error: "Error al eliminar la película" });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Película no encontrada" });
        }

        res.json({ mensaje: "Película eliminada correctamente" });
    });
}

module.exports.eliminarPelicula = eliminarPelicula;
