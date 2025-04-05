const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const mysql = require("mysql2");
const halson = require("halson");

// Configuración de conexión a la base de datos
const conexion = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
});

// Función para consultar el catálogo
function consultarCatalogo(req, res, next) {
    let consulta = "";
    let parametros = [];

    if (typeof req.query.id === "undefined") {
        consulta = "SELECT * FROM peliculas_series";
    } else {
        consulta = "SELECT * FROM peliculas_series WHERE id = ?";
        parametros.push(req.query.id);
    }

    conexion.query(consulta, parametros, (err, results) => {
        if (err) return next(err);
        if (results.length === 0) return next();

        let director = halson({
            nombre: "Christopher Nolan",
            biografia: "Director reconocido por su trabajo en películas de thriller y ciencia ficción",
            nacionalidad: "Británica",
        }).addLink("self", "/directores/christopher-nolan");

        if (req.query.id) {
            let pelicula = results[0];

            let recurso = halson({
                id: pelicula.id,
                titulo: pelicula.titulo,
                tipo: pelicula.tipo,
                genero: pelicula.genero,
                anio: pelicula.anio,
                calificacion: pelicula.calificacion,
                fecha_visto: pelicula.fecha_visto,
                fecha_inicio: pelicula.fecha_inicio,
                fecha_fin: pelicula.fecha_fin,
            })
            .addLink("self", { href: `/catalogo/${pelicula.id}`, method: "GET" })
            .addLink("Eliminar pelicula o serie", { href: `/catalogo/${pelicula.id}`, method: "DELETE" })
            .addEmbed("director", director);

            return res.render("detalle", { pelicula: recurso });
        }

        let catalogoHAL = results.map((pelicula) =>
            halson({
                id: pelicula.id,
                titulo: pelicula.titulo,
                tipo: pelicula.tipo,
                genero: pelicula.genero,
                anio: pelicula.anio,
                calificacion: pelicula.calificacion,
                fecha_visto: pelicula.fecha_visto,
                fecha_inicio: pelicula.fecha_inicio,
                fecha_fin: pelicula.fecha_fin,
            })
            .addLink("self", { href: `/catalogo/${pelicula.id}`, method: "GET" })
            .addLink("delete", { href: `/catalogo/${pelicula.id}`, method: "DELETE" })
            .addEmbed("director", director)
        );

        res.render("catalogo", { peliculas: catalogoHAL });
    });
}

// Función para eliminar una película
function eliminarPelicula(req, res) {
    const { id } = req.params;
    const sql = "DELETE FROM peliculas_series WHERE id = ?";

    conexion.query(sql, [id], (err, result) => {
        if (err) return res.status(500).json({ error: "Error al eliminar la película" });
        if (result.affectedRows === 0) return res.status(404).json({ error: "Película no encontrada" });

        res.json({ mensaje: "Película eliminada correctamente" });
    });
}

module.exports = { consultarCatalogo, eliminarPelicula };
