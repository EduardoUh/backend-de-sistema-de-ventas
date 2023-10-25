const express = require('express');
const { body } = require('express-validator');
const { verificarToken, verificarTipoUsuario, restringirAcceso, manejarResultados, revisarUsuarioYaExiste } = require('../middlewares/index.js');
const { crearUsuario } = require('../controllers/usuarios.js');


const usuariosRouter = express.Router();

const validadorNombres = () => body('nombres')
    .exists().withMessage('Los nombres son requeridos')
    .isString().withMessage('Los nombres deben ser una cadena de texto')
    .trim()
    .notEmpty().withMessage('Los nombres no pueden ser una cadena de texto vacía')
    .toUpperCase();

const validadorApellidoPaterno = () => body('apellidoPaterno')
    .exists().withMessage('El apellido paterno es requerido')
    .isString().withMessage('El apellido paterno debe ser una cadena de texto')
    .trim()
    .notEmpty().withMessage('El apellido paterno no puede ser una cadena de texto vacía')
    .toUpperCase();

const validadorApellidoMaterno = () => body('apellidoMaterno')
    .exists().withMessage('El apellido materno es requerido')
    .isString().withMessage('El apellido materno debe ser una cadena de texto')
    .trim()
    .notEmpty().withMessage('El apellido materno no puede ser una cadena de texto vacía')
    .toUpperCase()

const validadorRfc = () => body('rfc')
    .exists().withMessage('El rfc es requerido')
    .isString().withMessage('El rfc debe ser una cadena de texto')
    .trim()
    .notEmpty().withMessage('El rfc no puede ser una cadena de texto vacía');

const validadorIdBody = (nombre) => body(nombre)
    .exists().withMessage(`${nombre} es ${nombre === 'rol' ? 'requerido' : 'requerida'}`)
    .isString().withMessage(`${nombre} debe ser una cadena de texto`)
    .trim()
    .isLength({ min: 24, max: 24 }).withMessage(`${nombre} inválido`);

const validadorEmail = () => body('email')
    .exists().withMessage('El email es requerido')
    .isEmail().withMessage('El email no es válido');

const validadorPassword = () => body('password')
    .exists().withMessage('La contraseña es requerida')
    .isString().withMessage('La contraseña debe es una cadena de texto')
    .trim()
    .isLength({ min: 5 }).withMessage('La contraseña debe contener al menos 5 caracteres');

const validadorDireccion = () => body('direccion')
    .exists().withMessage('La dirección es requerida')
    .isString().withMessage('La dirección debe ser una cadena de texto')
    .trim()
    .notEmpty().withMessage('La dirección no puede ser una cadena de texto vacía')
    .toUpperCase();

const validadorNumTelefono = () => body('numTelefono')
    .exists().withMessage('El número de teléfono es requerido')
    .isString().withMessage('El número de teléfono debe ser una cadena de texto')
    .trim()
    .notEmpty().withMessage('EL número de teléfono no puede ser una cadena de texto vacía')

const activo = () => body('activo')
    .exists().withMessage('El estado es requerido')
    .isBoolean({ strict: true }).withMessage('Valor inválido')

usuariosRouter.post('/usuarios',
    verificarToken,
    verificarTipoUsuario,
    restringirAcceso,
    [
        validadorNombres(),
        validadorApellidoPaterno(),
        validadorApellidoMaterno(),
        validadorRfc(),
        validadorIdBody('rol'),
        validadorEmail(),
        validadorPassword(),
        validadorDireccion(),
        validadorNumTelefono()
    ],
    manejarResultados,
    revisarUsuarioYaExiste,
    crearUsuario
);

module.exports = {
    usuariosRouter
}