const express = require('express');
const { body, param } = require('express-validator');
const { isObjectIdOrHexString } = require('mongoose');
const { verificarToken, exponerDatosUsuario, verificarPermisosModuloCrearVenta, manejarResultados } = require('../middlewares/index.js');
const { crearVenta, obtenerVentas, obtenerVenta } = require('../controllers/ventas.js');


const ventasRouter = express.Router();

const validadorBodyId = (name) => body(name)
    .exists().withMessage(`El campo ${name} es requerido`)
    .isMongoId().withMessage(`El campo ${name} es inválido`);

const validadorArticulosArray = () => body('articulos')
    .exists().withMessage('El campo arituculos es requerido')
    .isArray({ min: 1 }).withMessage('Debe existir al menos un artículo en la venta')
    .custom(value => {
        for (const item of value) {
            if (!isObjectIdOrHexString(item.producto) || item.cantidad <= 0) {
                return false;
            }

            const decimalsArray = String(item.cantidad).split('.');

            if (decimalsArray.length > 1 && decimalsArray[1].length > 2) {
                return false;
            }
        }

        return true;
    }).withMessage('Artículo o cantidad del artículo es inválido');

const validadorCantidad = (name, min) => body(name)
    .exists().withMessage(`El campo ${name} es requerido`)
    .isFloat({ min }).withMessage(`El campo ${name} debe ser como mínimo igual a ${min}`)
    .custom(value => {
        const decimalsArray = String(value).split('.');

        if (decimalsArray.length > 1 && decimalsArray[1].length > 2) {
            return false;
        }

        return true;
    }).withMessage(`El campo ${name} debe contener como máximo dos decimales`);

const validadorIdParam = () => param('id')
    .exists().withMessage('El id de la venta es requerido')
    .isMongoId().withMessage('Id inválido');

ventasRouter.post('/ventas',
    verificarToken,
    exponerDatosUsuario,
    verificarPermisosModuloCrearVenta,
    [
        validadorBodyId('sucursal'),
        validadorArticulosArray(),
        validadorCantidad('total', 0.01),
        validadorCantidad('pagoCon', 0),
        validadorCantidad('pago', 0),
        validadorCantidad('cambio', 0),
        validadorCantidad('saldo', 0)
    ],
    manejarResultados,
    crearVenta
);

ventasRouter.get('/ventas',
    verificarToken,
    exponerDatosUsuario,
    obtenerVentas
);

ventasRouter.get('/ventas/:id',
    verificarToken,
    exponerDatosUsuario,
    validadorIdParam(),
    manejarResultados,
    obtenerVenta
);

module.exports = {
    ventasRouter
}
