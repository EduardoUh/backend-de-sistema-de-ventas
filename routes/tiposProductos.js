const express = require('express');
const { body } = require('express-validator');
const { verificarToken, exponerDatosUsuario, permitirSuperUsuariosYAdministradores, manejarResultados, revisarTipoProductoYaExiste } = require('../middlewares/index.js');
const { crearTipoProducto } = require('../controllers/tiposProductos.js');


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

module.exports = {
    tiposProductosRouter
};
