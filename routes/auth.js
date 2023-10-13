const express = require('express');
const { body } = require('express-validator');
const { manejarResultados } = require('../middlewares/index.js');
const { login } = require('../controllers/auth.js');


const authRouter = express.Router();

const validadorEmail = () => body('email')
    .exists().withMessage('El email es requerido')
    .isEmail().withMessage('El email no es válido');

const validadorPassword = () => body('password')
    .exists().withMessage('La contraseña es requerida')
    .trim()
    .isLength({ min: 5 }).withMessage('La contraseña debe contener al menos 5 caracteres');

authRouter.post('/auth/login',
    validadorEmail(),
    validadorPassword(),
    manejarResultados,
    login
);

module.exports = {
    authRouter
};
