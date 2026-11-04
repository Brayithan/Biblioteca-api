const express = require('express');
const cors = require('cors');
const libroRoutes = require('./routes/libroRoutes');
require('dotenv').config();
const usuarioRoutes = require('./routes/usuarioRoutes');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/libros', libroRoutes);
app.use('/api/usuarios', usuarioRoutes);

app.get('/', (req, res) => {
    res.json({ mensaje: 'API de Biblioteca funcionando correctamente' });
});

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});