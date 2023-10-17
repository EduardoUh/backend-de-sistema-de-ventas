const express = require('express');
const { body } = require('express-validator');
const { verificarToken, verificarTipoUsuario, manejarResultados, revisarSucursalYaExiste } = require('../middlewares/index.js');
const { crearSucursal } = require('../controllers/sucursales.js');


const sucursalesRouter = express.Router();

const validadorNombre = () => body('nombre')
    .exists().withMessage('El nombre es requerido')
    .isString().withMessage('El nombre debe ser una cadena de texto')
    .trim()
    .notEmpty().withMessage('El nombre no puede ser una cadena de texto vacía')
    .toUpperCase();

const validadorCiudad = () => body('ciudad')
    .exists().withMessage('La ciudad es requerida')
    .isString().withMessage('La ciudad debe ser una cadena de texto')
    .trim()
    .notEmpty().withMessage('La ciudad no puede ser una cadena de texto vacía')
    .toUpperCase();

const validadorDireccion = () => body('direccion')
    .exists().withMessage('La dirección es requerida')
    .isString().withMessage('La dirección debe ser una cadena de texto')
    .trim()
    .notEmpty().withMessage('La dirección no puede ser una cadena de texto vacía')
    .toUpperCase();

const validadorEmail = () => body('email')
    .exists().withMessage('El email es requerido')
    .isEmail().withMessage('El email no es válido');

const validadorActivo = () => body('activo')
    .exists().withMessage('El estatus de la sucursal es requerido')
    .isBoolean({ strict: true }).withMessage('El estatus debe ser true o false');

sucursalesRouter.post('/sucursales',
    verificarToken,
    verificarTipoUsuario,
    [
        validadorNombre(),
        validadorCiudad(),
        validadorDireccion(),
        validadorEmail()
    ],
    manejarResultados,
    revisarSucursalYaExiste,
    crearSucursal
);

module.exports = {
    sucursalesRouter
};
