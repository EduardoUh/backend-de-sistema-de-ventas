const express = require('express');
const { body, header } = require('express-validator');
const { manejarResultados, verificarToken, exponerDatosUsuario } = require('../middlewares/index.js');
const { login, renovarToken } = require('../controllers/auth.js');


const authRouter = express.Router();

const validadorEmail = () => body('email')
    .exists().withMessage('El email es requerido')
    .isEmail().withMessage('El email no es válido');

const validadorPassword = () => body('password')
    .exists().withMessage('La contraseña es requerida')
    .trim()
    .isLength({ min: 5 }).withMessage('La contraseña debe contener al menos 5 caracteres');

const validadorToken = () => header('x-token')
    .exists().withMessage('El token es requerido')
    .trim()
    .notEmpty().withMessage('El token no puede ser una cadena de texto vacía');

authRouter.post('/auth/login',
    validadorEmail(),
    validadorPassword(),
    manejarResultados,
    login
);

authRouter.get('/auth/renovar-token',
    validadorToken(),
    manejarResultados,
    verificarToken,
    exponerDatosUsuario,
    renovarToken
);

module.exports = {
    authRouter
};
