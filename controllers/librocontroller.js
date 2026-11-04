const conexion = require('../config/db');

// Consultar todos los libros
const obtenerLibros = (req, res) => {
    const sql = `
        SELECT 
            libro.id_libro,
            libro.titulo,
            categoria.nombre AS categoria,
            autor.nombre AS autor
        FROM libro
        INNER JOIN categoria 
            ON libro.id_categoria = categoria.id_categoria
        INNER JOIN autor 
            ON libro.id_autor = autor.id_autor
    `;

    conexion.query(sql, (error, resultados) => {
        if (error) {
            return res.status(500).json({
                mensaje: 'Error al consultar los libros',
                error: error.message
            });
        }

        res.json(resultados);
    });
};
// Consultar un libro por su ID
const obtenerLibroPorId = (req, res) => {
    const { id } = req.params;

    const sql = `
        SELECT 
            libro.id_libro,
            libro.titulo,
            categoria.nombre AS categoria,
            autor.nombre AS autor
        FROM libro
        INNER JOIN categoria 
            ON libro.id_categoria = categoria.id_categoria
        INNER JOIN autor 
            ON libro.id_autor = autor.id_autor
        WHERE libro.id_libro = ?
    `;

    conexion.query(sql, [id], (error, resultados) => {
        if (error) {
            return res.status(500).json({
                mensaje: 'Error al consultar el libro',
                error: error.message
            });
        }

        if (resultados.length === 0) {
            return res.status(404).json({
                mensaje: 'Libro no encontrado'
            });
        }

        res.json(resultados[0]);
    });
};
module.exports = {
    obtenerLibros,
     obtenerLibroPorId
};