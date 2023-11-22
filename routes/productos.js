const express = require('express');
const { body, param } = require('express-validator');
const { verificarToken, exponerDatosUsuario, permitirSuperUsuariosYAdministradores, manejarResultados, revisarProductoYaExiste } = require('../middlewares/index.js');
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

const validadorPrecio = () => body('precio')
    .exists().withMessage('El precio es requerido')
    .isFloat().withMessage('El precio debe ser númerico');

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
    permitirSuperUsuariosYAdministradores,
    [
        validadorNombre(),
        validadorDescripcion(),
        validadorIdBody('tipoProducto'),
        validadorPrecio(),
        validadorVentaPor()
    ],
    manejarResultados,
    revisarProductoYaExiste,
    crearProducto
);

productosRouter.put('/productos/:id',
    verificarToken,
    exponerDatosUsuario,
    permitirSuperUsuariosYAdministradores,
    [
        validadorIdParam(),
        validadorNombre(),
        validadorDescripcion(),
        validadorIdBody('tipoProducto'),
        validadorIdBody('proveedor'),
        validadorPrecio(),
        validadorVentaPor(),
        validadorActivo()
    ],
    manejarResultados,
    actualizarProducto
);

productosRouter.get('/productos',
    verificarToken,
    exponerDatosUsuario,
    permitirSuperUsuariosYAdministradores,
    obtenerProductos
);

productosRouter.get('/productos/:id',
    verificarToken,
    exponerDatosUsuario,
    permitirSuperUsuariosYAdministradores,
    validadorIdParam(),
    manejarResultados,
    obtenerProducto
);

module.exports = {
    productosRouter
}
