const express = require('express');
const { body, param } = require('express-validator');
const { verificarToken, exponerDatosUsuario, verificarPermisosModuloStock, manejarResultados, revisarStockProductoYaExiste } = require('../middlewares/index.js');
const { crearStockProducto, actualizarStock, obtenerResgistrosStock, obtenerResgistrosStockParaVenta, obtenerStockPorId } = require('../controllers/stockProductos.js');


const stockProductoRouter = express.Router();

const validadorProductoId = () => body('producto')
    .exists().withMessage('El producto es requerido')
    .isMongoId().withMessage('Producto inválido');

const validadorSucursalId = () => body('sucursal')
    .exists().withMessage('La sucursal es requerida')
    .isMongoId().withMessage('Sucursal inválida');

const validadorCantidades = (nombre) => body(nombre)
    .exists().withMessage(`El campo ${nombre} es requerido`)
    .isFloat({ gt: 0 }).withMessage(`El campo ${nombre} debe ser un valor númerico mayor a cero`)
    .custom(value => {
        const decimalsArray = String(value).split('.');

        if (decimalsArray.length > 1 && decimalsArray[1].length > 2) {
            return false;
        }

        return true;
    }).withMessage(`El campo ${nombre} debe contener dos decimales como máximo`);

const validadorId = () => param('id')
    .exists().withMessage('El id es requerido')
    .isMongoId().withMessage('Id inválido');

stockProductoRouter.post('/stockProductos',
    verificarToken,
    exponerDatosUsuario,
    verificarPermisosModuloStock,
    [
        validadorProductoId(),
        validadorSucursalId(),
        validadorCantidades('existencia'),
        validadorCantidades('precio')
    ],
    manejarResultados,
    revisarStockProductoYaExiste,
    crearStockProducto
);

stockProductoRouter.put('/stockProductos/:id',
    verificarToken,
    exponerDatosUsuario,
    verificarPermisosModuloStock,
    [
        validadorId(),
        validadorCantidades('existencia'),
        validadorCantidades('precio')
    ],
    manejarResultados,
    actualizarStock
);

stockProductoRouter.get('/stockProductos',
    verificarToken,
    exponerDatosUsuario,
    verificarPermisosModuloStock,
    obtenerResgistrosStock
);

stockProductoRouter.get('/stockProductos/sucursal/:id',
    verificarToken,
    exponerDatosUsuario,
    verificarPermisosModuloStock,
    validadorId(),
    manejarResultados,
    obtenerResgistrosStockParaVenta
);

stockProductoRouter.get('/stockProductos/:id',
    verificarToken,
    exponerDatosUsuario,
    verificarPermisosModuloStock,
    validadorId(),
    manejarResultados,
    obtenerStockPorId
);

module.exports = {
    stockProductoRouter
}
