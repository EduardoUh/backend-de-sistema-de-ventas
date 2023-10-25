const express = require('express');
const { body, param } = require('express-validator');
const { verificarToken, exponerDatosUsuario, manejarResultados, revisarSucursalYaExiste, permitirSuperUsuarios, permitirSuperUsuariosYAdministradores, verificarAdministradorPerteneceSucursal } = require('../middlewares/index.js');
const { crearSucursal, actualizarSucursal, obtenerSucursalPorId, obtenerSucursales } = require('../controllers/sucursales.js');


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

const validadorActivo = () => body('activa')
    .exists().withMessage('El estatus de la sucursal es requerido')
    .isBoolean({ strict: true }).withMessage('El estatus debe ser true o false');

const validadorId = () => param('id')
    .exists().withMessage('El id es requerido')
    .isString().withMessage('El id debe ser una cadena de texto')
    .trim()
    .isLength({ min: 24, max: 24 }).withMessage('Id inválido');

sucursalesRouter.post('/sucursales',
    verificarToken,
    exponerDatosUsuario,
    permitirSuperUsuarios,
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

sucursalesRouter.put('/sucursales/:id',
    verificarToken,
    exponerDatosUsuario,
    permitirSuperUsuariosYAdministradores,
    [
        validadorNombre(),
        validadorCiudad(),
        validadorDireccion(),
        validadorEmail(),
        validadorActivo(),
        validadorId()
    ],
    manejarResultados,
    verificarAdministradorPerteneceSucursal,
    actualizarSucursal
);

sucursalesRouter.get('/sucursales/:id',
    verificarToken,
    exponerDatosUsuario,
    permitirSuperUsuariosYAdministradores,
    validadorId(),
    manejarResultados,
    verificarAdministradorPerteneceSucursal,
    obtenerSucursalPorId
);

sucursalesRouter.get('/sucursales',
    verificarToken,
    exponerDatosUsuario,
    permitirSuperUsuarios,
    obtenerSucursales
);

module.exports = {
    sucursalesRouter
};
