const express = require('express');
const { body, param } = require('express-validator');
const { verificarToken, exponerDatosUsuario, permitirSuperUsuariosYAdministradores, manejarResultados, revisarStockProductoYaExiste } = require('../middlewares/index.js');
const { crearStockProducto } = require('../controllers/stockProductos.js');


const stockProductoRouter = express.Router();

const validadorProductoId = () => body('producto')
    .exists().withMessage('El producto es requerido')
    .isMongoId().withMessage('Producto inválido');

const validadorSucursalId = () => body('sucursal')
    .exists().withMessage('La sucursal es requerida')
    .isMongoId().withMessage('Sucursal inválida');

const validadorExistencia = () => body('existencia')
    .exists().withMessage('La existencia del producto es requerida')
    .isFloat({ gt: 0, min: 1 }).withMessage('La existencia debe ser un valor númerico de por lo menos un kg o una pieza')
    .isDecimal({ decimal_digits: 2, blacklisted_chars: '$' }).withMessage('La existencia debe contener dos decimales como máximo');

stockProductoRouter.post('/stockProductos',
    verificarToken,
    exponerDatosUsuario,
    permitirSuperUsuariosYAdministradores,
    [
        validadorProductoId(),
        validadorSucursalId(),
        validadorExistencia()
    ],
    manejarResultados,
    revisarStockProductoYaExiste,
    crearStockProducto
);

module.exports = {
    stockProductoRouter
}
