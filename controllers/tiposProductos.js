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
