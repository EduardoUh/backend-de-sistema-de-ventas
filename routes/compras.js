const express = require('express');
const { body, param } = require('express-validator');
const { isObjectIdOrHexString } = require('mongoose');
const { verificarToken, exponerDatosUsuario, verificarPermisosModuloCrearCompra, verificarPermisosModuloCompras, manejarResultados } = require('../middlewares/index.js');
const { crearCompra, obtenerCompras, obtenerCompra } = require('../controllers/compras.js');


const comprasRouter = express.Router();

const tieneDosDecimales = (value) => {
    if (typeof value !== 'number') {
        return false;
    }
    const valueArrSplittedByPoint = String(value).split('.');

    if (valueArrSplittedByPoint.length > 1 && valueArrSplittedByPoint[1].length > 2) {
        return false;
    }

    return true
}

const validadorBodyId = (nombre) => body(nombre)
    .exists().withMessage(`El campo ${nombre} es requerido`)
    .isMongoId().withMessage(`El campo ${nombre} es inválido`);

const validadorArticulos = () => body('articulos')
    .exists().withMessage('El campo articulos es requerido')
    .isArray({ min: 1 }).withMessage('El campo articulos debe contener al menos un artículo')
    .custom((value) => {
        for (const item of value) {
            if (Object.keys(item).length !== 4) {
                return false;
            }

            if (!item.producto || !isObjectIdOrHexString(item.producto)
                || !item.precioCompra || !tieneDosDecimales(item.precioCompra)
                || !item.precioVenta || !tieneDosDecimales(item.precioVenta)
                || !item.cantidad || !tieneDosDecimales(item.cantidad)
            ) {
                return false;
            }
        }

        return true;
    }).withMessage('Alguno de los siguientes datos de los artículos es erroneo: producto, precio compra, precio venta o cantidad');

const validadorTotal = () => body('total')
    .exists().withMessage('El campo total es requerido')
    .isFloat({ min: 0.1 }).withMessage('El total debe ser mayor a cero')
    .custom((value) => {
        return tieneDosDecimales(value);
    }).withMessage('No se admiten más de dos decimales');

const validadorParamId = () => param('id')
    .isMongoId().withMessage('Id inválido');

comprasRouter.post('/compras',
    verificarToken,
    exponerDatosUsuario,
    verificarPermisosModuloCrearCompra,
    [
        validadorBodyId('sucursal'),
        validadorBodyId('proveedor'),
        validadorArticulos(),
        validadorTotal()
    ],
    manejarResultados,
    crearCompra
);

comprasRouter.get('/compras',
    verificarToken,
    exponerDatosUsuario,
    verificarPermisosModuloCompras,
    obtenerCompras
);

comprasRouter.get('/compras/:id',
    verificarToken,
    exponerDatosUsuario,
    verificarPermisosModuloCompras,
    validadorParamId(),
    manejarResultados,
    obtenerCompra
);

module.exports = {
    comprasRouter
}
