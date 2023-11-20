const { request, response } = require('express');
const { filtrarQueryParams } = require('../helpers/index.js');
const { Producto, Sucursal, StockProductos } = require('../models/index.js');


module.exports.crearStockProducto = async (req = request, res = response) => {
    const { producto: productoId, sucursal: sucursalId, existencia } = req.body;
    const { esAdministrador, sucursalUsuario } = req;

    try {
        const promises = [Producto.findById(productoId), Sucursal.findById(sucursalId)];

        const [producto, sucursal] = await Promise.all(promises);

        if (!producto || !sucursal) {
            return res.status(404).json({
                ok: false,
                message: 'Producto o sucursal no encontrado'
            });
        }

        if (!producto.activo || !sucursal.activa) {
            return res.status(403).json({
                ok: false,
                message: 'El producto o la sucursal se encuentra desactivado'
            });
        }

        if (esAdministrador && sucursalUsuario !== sucursalId) {
            return res.status(401).json({
                ok: false,
                message: 'Sin acceso a ésta sucursal'
            });
        }

        if (producto.ventaPor === 'PIEZA' && existencia % 1 > 0) {
            return res.status(403).json({
                ok: false,
                message: 'El producto se vende por piezas, por lo que no se aceptan decimales'
            });
        }

        const stockProducto = new StockProductos({ producto: productoId, sucursal: sucursalId, existencia });

        await stockProducto.save();

        res.status(201).json({
            ok: true,
            message: `Producto ${producto.nombre} añadido con éxito al stock de la sucursal ${sucursal.nombre}`
        })

    } catch (error) {
        console.log(error);

        res.status(500).json({
            ok: false,
            message: 'Algo salió mal al crear el stock, intente de nuevo y si el fallo persiste contacte al administrador'
        });
    }
}

module.exports.actualizarStock = async (req = request, res = response) => {
    const { producto: productoId, sucursal: sucursalId, existencia } = req.body;
    const { id: stockId } = req.params;
    const { esAdministrador, sucursalUsuario } = req;

    try {
        const promises = [Producto.findById(productoId), Sucursal.findById(sucursalId), StockProductos.findById(stockId)];

        const [producto, sucursal, stockProducto] = await Promise.all(promises);

        if (!producto || !sucursal || !stockProducto) {
            return res.status(404).json({
                ok: false,
                message: 'Producto, sucursal o stock no encontrado'
            });
        }

        if (!producto.activo || !sucursal.activa) {
            return res.status(403).json({
                ok: false,
                message: 'El producto o la sucursal se encuentran desactivados'
            });
        }

        if (esAdministrador && sucursalUsuario !== sucursalId) {
            return res.status(401).json({
                ok: false,
                message: 'Sin acceso a ésta sucursal'
            });
        }

        if (producto.ventaPor === 'PIEZA' && existencia % 1 > 0) {
            return res.status(403).json({
                ok: false,
                message: 'El producto se vende por piezas, por lo que no se aceptan decimales'
            });
        }

        await stockProducto.updateOne({ existencia });

        res.status(200).json({
            ok: true,
            message: `Stock del producto ${producto.nombre} actualizado con éxito`
        })

    } catch (error) {
        console.log(error);

        res.status(500).json({
            ok: false,
            message: 'Algo salió mal al actualizar el stock, intente de nuevo y si el fallo persiste contacte al administrador'
        });
    }
}
