const express = require('express');
const { body, param } = require('express-validator');
const { verificarToken, exponerDatosUsuario, permitirSuperUsuariosYAdministradores, manejarResultados, revisarTipoProductoYaExiste } = require('../middlewares/index.js');
const { crearTipoProducto, actualizarTipoProducto, obtenerTiposProductos } = require('../controllers/tiposProductos.js');


const tiposProductosRouter = express.Router();

const validadorTipoProducto = () => body('tipoProducto')
    .exists().withMessage('El tipo de producto es requerido')
    .isString().withMessage('El tipo de producto debe ser una cadena de texto')
    .trim()
    .notEmpty().withMessage('El tipo de producto no puede ser una cadena de texto vacía')
    .toUpperCase();

const validadorDescripcion = () => body('descripcion')
    .exists().withMessage('La descripcion es requerida')
    .isString().withMessage('La descripcion debe ser una cadena de texto')
    .trim()
    .notEmpty().withMessage('La descripcion no puede ser una cadena de texto vacía')
    .toUpperCase();

const validadorActivo = () => body('activo')
    .exists().withMessage('El estatus es requerido')
    .isBoolean({ strict: true }).withMessage('El estatus debe ser true o false');

const validadorId = () => param('id')
    .exists().withMessage('El id es requerido')
    .isString().withMessage('El id debe ser una cadena de texto')
    .trim()
    .isLength({ min: 24, max: 24 }).withMessage('Id inválido');

tiposProductosRouter.post('/tiposProductos',
    verificarToken,
    exponerDatosUsuario,
    permitirSuperUsuariosYAdministradores,
    [
        validadorTipoProducto(),
        validadorDescripcion()
    ],
    manejarResultados,
    revisarTipoProductoYaExiste,
    crearTipoProducto
);

tiposProductosRouter.put('/tiposProductos/:id',
    verificarToken,
    exponerDatosUsuario,
    permitirSuperUsuariosYAdministradores,
    [
        validadorTipoProducto(),
        validadorDescripcion(),
        validadorActivo(),
        validadorId()
    ],
    manejarResultados,
    actualizarTipoProducto
);

tiposProductosRouter.get('/tiposProductos',
    verificarToken,
    exponerDatosUsuario,
    permitirSuperUsuariosYAdministradores,
    obtenerTiposProductos
);

module.exports = {
    tiposProductosRouter
};
