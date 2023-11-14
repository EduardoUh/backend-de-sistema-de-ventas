const { request, response } = require('express');
const { filtrarQueryParams } = require('../helpers/index.js');
const { Producto } = require('../models/index.js');


module.exports.crearProducto = async (req = request, res = response) => {
    const { nombre, descripcion, tipoProducto, proveedor, precio } = req.body;

    try {
        const producto = new Producto({ nombre, descripcion, tipoProducto, proveedor, precio });

        await producto.save();

        res.status(201).json({
            ok: true,
            message: `Producto ${nombre} creado con éxito`
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            ok: false,
            message: 'Algo salió mal al intentar registrar el producto, intente de nuevo y si el fallo persiste contacte al administrador'
        });
    }
}
