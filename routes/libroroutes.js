const express = require('express');
const router = express.Router();

const { obtenerLibros, obtenerLibroPorId} = require('../controllers/libroController');

// Ruta para consultar todos los libros
router.get('/', obtenerLibros);
router.get('/:id', obtenerLibroPorId);

module.exports = router;