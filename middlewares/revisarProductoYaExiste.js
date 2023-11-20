const { request, response } = require('express');
const { Producto } = require('../models/Productos.js');


module.exports.revisarProductoYaExiste = async (req = request, res = response, next) => {
    const { nombre, descripcion, tipoProducto, proveedor, precio, ventaPor } = req.body;

    try {
        const producto = await Producto.findOne({ nombre, descripcion, tipoProducto, proveedor, precio, ventaPor });

        if (producto) {
            return res.status(409).json({
                ok: false,
                message: 'Ya existe un producto con esa información'
            });
        }

        next();

    } catch (error) {
        console.log(error);

        res.status(500).json({
            ok: false,
            message: 'Algo salió mal al verificar el producto, intente de nuevo y si el fallo persiste contacte al administrador'
        });
    }
}
