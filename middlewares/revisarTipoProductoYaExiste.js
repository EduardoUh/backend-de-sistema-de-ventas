const { request, response } = require('express');
const { TipoProducto } = require('../models/index.js');


module.exports.revisarTipoProductoYaExiste = async (req = request, res = response, next) => {
    const { tipoProducto, descripcion } = req.body;

    try {
        const tipoProductoEncontrado = await TipoProducto.findOne({ tipoProducto, descripcion });

        if (tipoProductoEncontrado) {
            return res.status(409).json({
                ok: false,
                message: 'Ya existe un tipo de producto con esos datos'
            });
        }

        next();

    } catch (error) {
        console.log(error);

        res.status(500).json({
            ok: false,
            message: 'Algo salió mal, intente de nuevo y si el fallo persiste contacte al administrador'
        });
    }
}
