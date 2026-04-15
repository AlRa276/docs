const { Usuario } = require('../models/index'); 
const jwt = require('jsonwebtoken');
const service = require('../services/authService');

const registrar = async (req, res, next) => {
  try {
    const resultado = await service.registrar(req.body);
    res.status(201).json({ ok: true, ...resultado });
  } catch (err) { next(err); }
};

const login = async (req, res, next) => {
  try {
    const resultado = await service.login(req.body);
    res.json({ ok: true, ...resultado });
  } catch (err) { next(err); }
};

const perfil = async (req, res, next) => {
  try {
    // req.usuario viene del middleware verificarToken
    const usuario = await service.perfil(req.usuario.id);
    res.json({ ok: true, usuario });
  } catch (err) { next(err); }
};

const logout = (req, res) => {
  res.json({
    ok:      true,
    mensaje: 'Sesión cerrada correctamente. Elimina el token del cliente.',
  });
};


const admin = require('../config/firebase');


const loginConGoogle = async (req, res) => {
    try {
        const { idToken } = req.body;

        if (!idToken) {
            return res.status(400).json({ error: "El token de Firebase es requerido" });
        }

        
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        const { email, name, picture } = decodedToken;

        
        let usuario = await Usuario.findOne({ 
            where: { correo_electronico: email } 
        });

        // 3. Si no existe, registrar al usuario con los campos exactos de tu DB
        if (!usuario) {
            usuario = await Usuario.create({
                correo_electronico: email,
                nombre_mostrar: name, 
                url_foto: picture,
                rol: 'usuario', // O el rol por defecto que uses
                // Para el password, al ser social login, usamos un valor placeholder
                password_hash: 'login_social_google_no_password'
            });
        }

        
        const tokenLocal = jwt.sign(
            { id: usuario.id, email: usuario.correo_electronico, rol : usuario.rol },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

      
        return res.status(200).json({
            mensaje: "Login con Google exitoso",
            token: tokenLocal,
            usuario: {
                id: usuario.id,
                nombre: usuario.nombre_mostrar,
                email: usuario.correo_electronico,
                rol: usuario.rol
            }
        });

    } catch (error) {
        // Imprimimos el error real en la consola de Railway para poder debuguear
        console.error("Error en loginConGoogle:", error);
        
        // Si el error es de base de datos, lo enviamos específicamente (opcional para desarrollo)
        if (error.name === 'SequelizeDatabaseError') {
            return res.status(500).json({ error: "Error de base de datos", detalle: error.message });
        }

        return res.status(401).json({ error: "Token de Google inválido o expirado" });
    }
};




module.exports = { registrar, login, perfil, logout, loginConGoogle };
