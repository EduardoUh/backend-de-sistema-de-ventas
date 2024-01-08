const express = require('express');
const { body, param } = require('express-validator');
const { verificarToken, exponerDatosUsuario, verificarPermisosModuloProveedores, revisarProveedorYaExiste, manejarResultados } = require('../middlewares/index.js');
const { crearProveedor, actualizarProveedor, obtenerProveedores, obtenerProveedorPorId } = require('../controllers/proveedores.js');


const proveedoresRouter = express.Router();

const validadorNombre = () => body('nombre')
    .exists().withMessage('El nombre es requerido')
    .isString().withMessage('El nombre debe ser una cadena de texto')
    .trim()
    .notEmpty().withMessage('El nombre no puede ser una cadena de texto vacía')
    .toUpperCase();

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
    .notEmpty().withMessage('El número de teléfono no puede ser una cadena de texto vacía');

const validadorEmail = () => body('email')
    .exists().withMessage('El email es requerido')
    .isEmail().withMessage('Email inválido');

const validadorRfc = () => body('rfc')
    .exists().withMessage('El rfc es requerido')
    .isString().withMessage('El rfc debe ser una cadena de texto')
    .trim()
    .notEmpty().withMessage('El rfc no puede ser una cadena de texto vacía');

const validadorActivo = () => body('activo')
    .exists().withMessage('El estatus del proveedor es requerido')
    .isBoolean({ strict: true }).withMessage('Estatus inválido');

const validadorId = () => param('id')
    .exists().withMessage('El id es requerido')
    .isString().withMessage('El id debe ser una cadena de texto')
    .trim()
    .isLength({ min: 24, max: 24 }).withMessage('Id inválido');

proveedoresRouter.post('/proveedores',
    verificarToken,
    exponerDatosUsuario,
    verificarPermisosModuloProveedores,
    [
        validadorNombre(),
        validadorDireccion(),
        validadorNumTelefono(),
        validadorEmail(),
        validadorRfc()
    ],
    manejarResultados,
    revisarProveedorYaExiste,
    crearProveedor
);

proveedoresRouter.put('/proveedores/:id',
    verificarToken,
    exponerDatosUsuario,
    verificarPermisosModuloProveedores,
    [
        validadorNombre(),
        validadorDireccion(),
        validadorNumTelefono(),
        validadorEmail(),
        validadorRfc(),
        validadorActivo(),
        validadorId()
    ],
    manejarResultados,
    actualizarProveedor
);

proveedoresRouter.get('/proveedores',
    verificarToken,
    exponerDatosUsuario,
    verificarPermisosModuloProveedores,
    obtenerProveedores
);

proveedoresRouter.get('/proveedores/:id',
    verificarToken,
    exponerDatosUsuario,
    verificarPermisosModuloProveedores,
    [
        validadorId()
    ],
    manejarResultados,
    obtenerProveedorPorId
);

module.exports = {
    proveedoresRouter
}
