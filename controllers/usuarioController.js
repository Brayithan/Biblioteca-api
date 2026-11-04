const conexion = require('../config/db');
const bcrypt = require('bcryptjs');

// Registrar un usuario
const registrarUsuario = async (req, res) => {
    const { nombre, correo, telefono, direccion, contrasena } = req.body;

    // Validar campos obligatorios
    if (!nombre || !correo || !contrasena) {
        return res.status(400).json({
            mensaje: 'Nombre, correo y contraseña son obligatorios'
        });
    }

    try {
        // Encriptar contraseña
        const contrasenaHash = await bcrypt.hash(contrasena, 10);

        const sql = `
            INSERT INTO usuario
            (nombre, correo, telefono, direccion, contrasena)
            VALUES (?, ?, ?, ?, ?)
        `;

        conexion.query(
            sql,
            [nombre, correo, telefono, direccion, contrasenaHash],
            (error, resultado) => {
                if (error) {
                    if (error.code === 'ER_DUP_ENTRY') {
                        return res.status(409).json({
                            mensaje: 'El correo ya está registrado'
                        });
                    }

                    return res.status(500).json({
                        mensaje: 'Error al registrar el usuario',
                        error: error.message
                    });
                }

                res.status(201).json({
                    mensaje: 'Usuario registrado correctamente',
                    id_usuario: resultado.insertId
                });
            }
        );

    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al procesar la contraseña'
        });
    }
};
// Iniciar sesión
const iniciarSesion = (req, res) => {
    const { correo, contrasena } = req.body;

    if (!correo || !contrasena) {
        return res.status(400).json({
            mensaje: 'Correo y contraseña son obligatorios'
        });
    }

    const sql = 'SELECT * FROM usuario WHERE correo = ?';

    conexion.query(sql, [correo], async (error, resultados) => {
        if (error) {
            return res.status(500).json({
                mensaje: 'Error al iniciar sesión'
            });
        }

        if (resultados.length === 0) {
            return res.status(401).json({
                mensaje: 'Credenciales incorrectas'
            });
        }

        const usuario = resultados[0];

        const coincide = await bcrypt.compare(
            contrasena,
            usuario.contrasena
        );

        if (!coincide) {
            return res.status(401).json({
                mensaje: 'Credenciales incorrectas'
            });
        }

        res.json({
            mensaje: 'Inicio de sesión exitoso',
            usuario: {
                id_usuario: usuario.id_usuario,
                nombre: usuario.nombre,
                correo: usuario.correo
            }
        });
    });
};

module.exports = {
    registrarUsuario,
    iniciarSesion
};