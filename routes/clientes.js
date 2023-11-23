const express = require('express');
const { body, param } = require('express-validator');
const { verificarToken, exponerDatosUsuario, permitirSuperUsuariosYAdministradores, manejarResultados, revisarClienteYaExiste } = require('../middlewares/index.js');
const { crearCliente, actualizarCliente } = require('../controllers/clientes.js');

const clientesRouter = express.Router();

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
    .toUpperCase();

const validadorRfc = () => body('rfc')
    .exists().withMessage('El rfc es requerido')
    .isString().withMessage('El rfc debe ser una cadena de texto')
    .trim()
    .notEmpty().withMessage('El rfc no puede ser una cadena de texto vacía');

const validadorEmail = () => body('email')
    .exists().withMessage('El email es requerido')
    .isEmail().withMessage('El email no es válido');

const validadorNumTelefono = () => body('numTelefono')
    .exists().withMessage('El número de teléfono es requerido')
    .isString().withMessage('El número de teléfono debe ser una cadena de texto')
    .trim()
    .notEmpty().withMessage('EL número de teléfono no puede ser una cadena de texto vacía');

const validadorDireccion = () => body('direccion')
    .exists().withMessage('La dirección es requerida')
    .isString().withMessage('La dirección debe ser una cadena de texto')
    .trim()
    .notEmpty().withMessage('La dirección no puede ser una cadena de texto vacía')
    .toUpperCase();

const validadorActivo = () => body('activo')
    .exists().withMessage('El estado es requerido')
    .isBoolean({ strict: true }).withMessage('Valor inválido');

const validadorIdParam = () => param('id')
    .isString().withMessage('El id debe ser una cadena de texto')
    .isMongoId().withMessage('Id inválido');

clientesRouter.post('/clientes',
    verificarToken,
    exponerDatosUsuario,
    permitirSuperUsuariosYAdministradores,
    [
        validadorNombres(),
        validadorApellidoPaterno(),
        validadorApellidoMaterno(),
        validadorRfc(),
        validadorEmail(),
        validadorNumTelefono(),
        validadorDireccion()
    ],
    manejarResultados,
    revisarClienteYaExiste,
    crearCliente
);

clientesRouter.put('/clientes/:id',
    verificarToken,
    exponerDatosUsuario,
    permitirSuperUsuariosYAdministradores,
    [
        validadorIdParam(),
        validadorNombres(),
        validadorApellidoPaterno(),
        validadorApellidoMaterno(),
        validadorRfc(),
        validadorEmail(),
        validadorNumTelefono(),
        validadorDireccion(),
        validadorActivo()
    ],
    manejarResultados,
    actualizarCliente
);

module.exports = { clientesRouter }
