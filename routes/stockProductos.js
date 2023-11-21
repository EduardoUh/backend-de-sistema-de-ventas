const express = require('express');
const { body, param } = require('express-validator');
const { verificarToken, exponerDatosUsuario, permitirSuperUsuariosYAdministradores, manejarResultados, revisarStockProductoYaExiste } = require('../middlewares/index.js');
const { crearStockProducto, actualizarStock, obtenerResgistrosStock, obtenerResgistrosStockParaVenta } = require('../controllers/stockProductos.js');


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
    .custom(value => {
        const decimalsArray = String(value).split('.');

        if (decimalsArray.length > 1 && decimalsArray[1].length > 2) {
            return false;
        }

        return true;
    }).withMessage('La existencia debe contener dos decimales como máximo');

const validadorId = () => param('id')
    .exists().withMessage('El id es requerido')
    .isMongoId().withMessage('Id inválido');

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

stockProductoRouter.put('/stockProductos/:id',
    verificarToken,
    exponerDatosUsuario,
    permitirSuperUsuariosYAdministradores,
    [
        validadorId(),
        validadorProductoId(),
        validadorSucursalId(),
        validadorExistencia()
    ],
    manejarResultados,
    actualizarStock
);

stockProductoRouter.get('/stockProductos',
    verificarToken,
    exponerDatosUsuario,
    permitirSuperUsuariosYAdministradores,
    obtenerResgistrosStock
);

stockProductoRouter.get('/stockProductos/sucursal/:id',
    verificarToken,
    exponerDatosUsuario,
    validadorId(),
    manejarResultados,
    obtenerResgistrosStockParaVenta
);

module.exports = {
    stockProductoRouter
}
