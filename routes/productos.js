const express = require('express');
const { body, param } = require('express-validator');
const { verificarToken, exponerDatosUsuario, verificarPermisosModuloProductos, manejarResultados, revisarProductoYaExiste } = require('../middlewares/index.js');
const { crearProducto, actualizarProducto, obtenerProductos, obtenerProducto } = require('../controllers/productos.js');


const productosRouter = express.Router();

const validadorNombre = () => body('nombre')
    .exists().withMessage('El nombre es requerido')
    .isString().withMessage('El nombre debe ser una cadena de texto')
    .trim()
    .notEmpty().withMessage('El nombre no puede ser una cadena de texto vacía')
    .toUpperCase();

const validadorDescripcion = () => body('descripcion')
    .exists().withMessage('La descripción es requerida')
    .isString().withMessage('La descripción debe ser una cadena de texto')
    .trim()
    .notEmpty().withMessage('La descripción no puede ser una cadena de texto vacía')
    .toUpperCase();

const validadorIdBody = (id) => body(id)
    .exists().withMessage(`El ${id === 'proveedor' ? 'proveedor' : 'tipo de producto'} es requerido`)
    .isMongoId().withMessage(`El formato del ${id === 'proveedor' ? 'proveedor' : 'tipo de producto'} es inválido`);

const validadorVentaPor = () => body('ventaPor')
    .exists().withMessage('El campo venta por es requerido')
    .isString().withMessage('El campo venta por debe ser una cadena de texto')
    .trim()
    .notEmpty().withMessage('El campo venta por no puede ser una cadena de texto vacía')
    .toUpperCase()
    .custom(value => {
        if (value !== 'KILOGRAMO' && value !== 'PIEZA') {
            return false;
        }
        return true;
    }).withMessage('El valor del campo venta por es inválido');

const validadorActivo = () => body('activo')
    .exists().withMessage('El estatus es requerido')
    .isBoolean({ strict: true }).withMessage('Estatus inválido');

const validadorIdParam = () => param('id')
    .isString().withMessage('El id debe ser una cadena de texto')
    .trim()
    .isLength({ min: 24, max: 24 }).withMessage('Id inválido');

productosRouter.post('/productos',
    verificarToken,
    exponerDatosUsuario,
    verificarPermisosModuloProductos,
    [
        validadorNombre(),
        validadorDescripcion(),
        validadorIdBody('tipoProducto'),
        validadorIdBody('proveedor'),
        validadorVentaPor()
    ],
    manejarResultados,
    revisarProductoYaExiste,
    crearProducto
);

productosRouter.put('/productos/:id',
    verificarToken,
    exponerDatosUsuario,
    verificarPermisosModuloProductos,
    [
        validadorIdParam(),
        validadorNombre(),
        validadorDescripcion(),
        validadorIdBody('tipoProducto'),
        validadorIdBody('proveedor'),
        validadorVentaPor(),
        validadorActivo()
    ],
    manejarResultados,
    actualizarProducto
);

productosRouter.get('/productos',
    verificarToken,
    exponerDatosUsuario,
    verificarPermisosModuloProductos,
    obtenerProductos
);

productosRouter.get('/productos/:id',
    verificarToken,
    exponerDatosUsuario,
    verificarPermisosModuloProductos,
    validadorIdParam(),
    manejarResultados,
    obtenerProducto
);

module.exports = {
    productosRouter
}
