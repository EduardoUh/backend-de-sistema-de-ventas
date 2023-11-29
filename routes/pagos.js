const express = require('express');
const { body, param } = require('express-validator');
const { verificarToken, exponerDatosUsuario, manejarResultados } = require('../middlewares/index.js');
const { crearPago, ObtenerPagosPorVenta } = require('../controllers/pagos.js');


const pagosRouter = express.Router();

const validadorBodyId = (name) => body(name)
    .exists().withMessage(`El campo ${name} es requerido`)
    .isMongoId().withMessage(`El campo ${name} es inválido`);

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

//venta pagoCon cantidad cambio saldo

pagosRouter.post('/pagos',
    verificarToken,
    exponerDatosUsuario,
    [
        validadorBodyId('venta'),
        validadorCantidad('pagoCon', 0.01),
        validadorCantidad('cantidad', 0.01),
        validadorCantidad('cambio', 0),
        validadorCantidad('saldo', 0)
    ],
    manejarResultados,
    crearPago
);

pagosRouter.get('/pagos/venta/:id',
    verificarToken,
    exponerDatosUsuario,
    validadorIdParam(),
    manejarResultados,
    ObtenerPagosPorVenta
);

module.exports = {
    pagosRouter
}
