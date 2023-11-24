const { request, response } = require('express');
const { filtrarQueryParams, transformarDatosPopulatedTipoProducto, transformarDatosPopulatedProveedor } = require('../helpers/index.js');
const { Producto, TipoProducto, Proveedor } = require('../models/index.js');


module.exports.crearProducto = async (req = request, res = response) => {
    const { nombre, descripcion, tipoProducto, proveedor, precio, ventaPor } = req.body;

    try {
        const promises = [TipoProducto.findById(tipoProducto), Proveedor.findById(proveedor)];

        const [tipoProductoDb, proveedorDb] = await Promise.all(promises);

        if (!tipoProductoDb || !proveedorDb) {
            return res.status(404).json({
                ok: false,
                message: 'El proveedor y/o el tipo producto no han sido encontrados'
            });
        }

        const producto = new Producto({ nombre, descripcion, tipoProducto, proveedor, precio, ventaPor });

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
    const { nombre, descripcion, tipoProducto, proveedor, precio, ventaPor, activo } = req.body;
    const { id: productoId } = req.params;

    try {
        const producto = await Producto.findById(productoId);

        if (!producto) {
            return res.status(404).json({
                ok: false,
                message: 'El producto no existe'
            });
        }

        await producto.updateOne({ nombre, descripcion, tipoProducto, proveedor, precio, ventaPor, activo });

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
        const params = filtrarQueryParams(queryParams, ['nombre', 'tipoProducto', 'proveedor', 'precio', 'ventaPor', 'activo']);

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

module.exports.obtenerProducto = async (req = request, res = response) => {
    const { id: productoId } = req.params;

    try {
        const producto = await Producto.findById(productoId)
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

        if (!producto) {
            return res.status(404).json({
                ok: false,
                message: 'Producto inexistente'
            });
        }

        res.status(200).json({
            ok: true,
            producto
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            ok: false,
            message: 'Algo salió mal al obtener el producto, intente de nuevo y si el fallo persiste contacte al administrador'
        });
    }
}
