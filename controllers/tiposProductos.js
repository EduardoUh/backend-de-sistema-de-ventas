const { request, response } = require('express');
const { filtrarQueryParams } = require('../helpers/index.js');
const { TipoProducto } = require('../models/index.js');


module.exports.crearTipoProducto = async (req = request, res = response) => {
    const { tipoProducto, descripcion } = req.body;

    try {
        const newTipoProducto = new TipoProducto({ tipoProducto, descripcion });

        await newTipoProducto.save();

        res.status(201).json({
            ok: true,
            message: `Tipo de producto ${tipoProducto} creado con éxtito`
        });

    } catch (error) {
        console.log(error);

        if (error.code === 11000) {
            return res.status(409).json({
                ok: false,
                message: 'Ya existe ése tipo de producto'
            });
        }

        res.status(500).json({
            ok: false,
            message: 'Algo salió mal al crear el tipo de producto, intente de nuevo y si el fallo persiste contacte al administrador'
        });
    }
}

module.exports.actualizarTipoProducto = async (req = request, res = response) => {
    const { tipoProducto, descripcion, activo } = req.body;
    const { id: tipoProductoId } = req.params;

    try {
        const tipoProductoEncontrado = await TipoProducto.findById(tipoProductoId);

        if (!tipoProductoEncontrado) {
            return res.status(404).json({
                ok: false,
                message: 'Tipo de producto inexistente'
            });
        }

        await tipoProductoEncontrado.updateOne({ tipoProducto, descripcion, activo });

        res.status(200).json({
            ok: true,
            message: `Tipo de producto ${tipoProducto} actualizado correctamente`
        });

    } catch (error) {
        console.log(error);

        if (error.code === 11000) {
            return res.status(409).json({
                ok: false,
                message: 'Ya existe ése tipo de producto'
            });
        }

        res.status(500).json({
            ok: false,
            message: 'Algo salió mal al actualizar el tipo de producto, intente de nuevo y si el fallo persiste contacte al administrador'
        });
    }
}

module.exports.obtenerTiposProductos = async (req = request, res = response) => {
    const queryParams = req.query;

    try {
        const params = filtrarQueryParams(queryParams, ['tipoProducto', 'descripcion', 'activo']);

        const tiposProductos = await TipoProducto.find(params);

        if (tiposProductos.length === 0) {
            return res.status(404).json({
                ok: false,
                message: 'No se encontraron registros'
            });
        }

        res.status(200).json({
            ok: true,
            tiposProductos
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            ok: false,
            message: 'Algo salió mal al obtener los registros, intente de nuevo y si el fallo persiste contacte al administrador'
        });
    }
}

module.exports.obtenerTipoProductoPorId = async (req = request, res = response) => {
    const { id: tipoProductoId } = req.params;

    try {
        const tipoProducto = await TipoProducto.findById(tipoProductoId);

        if (!tipoProducto) {
            return res.status(404).json({
                ok: false,
                message: 'No se encontraron registros'
            });
        }

        res.status(200).json({
            ok: true,
            tipoProducto
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            ok: false,
            message: 'Algo salió mal al obtener el registro, intente de nuevo y si el fallo persiste contacte al administrador'
        });
    }
}