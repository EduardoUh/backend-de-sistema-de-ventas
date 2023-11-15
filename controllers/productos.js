const { request, response } = require('express');
const { filtrarQueryParams, transformarDatosPopulatedTipoProducto, transformarDatosPopulatedProveedor } = require('../helpers/index.js');
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

module.exports.actualizarProducto = async (req = request, res = response) => {
    const { nombre, descripcion, tipoProducto, proveedor, precio, activo } = req.body;
    const { id: productoId } = req.params;

    try {
        const producto = await Producto.findById(productoId);

        if (!producto) {
            return res.status(404).json({
                ok: false,
                message: 'El producto no existe'
            });
        }

        await producto.updateOne({ nombre, descripcion, tipoProducto, proveedor, precio, activo });

        res.status(200).json({
            ok: true,
            message: `Producto ${nombre} actualizado con éxito`
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            ok: false,
            message: 'Algo salió mal al actualizar el producto, intente de nuevo y si el fallo persiste contacte al administrador'
        });
    }
}

module.exports.obtenerProductos = async (req = request, res = response) => {
    const queryParams = req.query;

    try {
        const params = filtrarQueryParams(queryParams, ['nombre', 'tipoProducto', 'proveedor', 'precio', 'activo']);

        const productos = await Producto.find(params)
            .populate({
                path: 'tipoProducto',
                options: {
                    transform: transformarDatosPopulatedTipoProducto
                }
            })
            .populate({
                path: 'proveedor',
                options: {
                    transform: transformarDatosPopulatedProveedor
                }
            });

        if (productos.length === 0) {
            return res.status(404).json({
                ok: false,
                message: 'No se encontraron registros'
            });
        }

        res.status(200).json({
            ok: true,
            productos
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            ok: false,
            message: 'Algo salió mal al obtener los productos, intente de nuevo y si el fallo persiste contacte al administrador'
        });
    }
}
