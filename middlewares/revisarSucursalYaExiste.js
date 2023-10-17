const { request, response } = require('express');
const { Sucursal } = require('../models/index.js');


module.exports.revisarSucursalYaExiste = async (req = request, res = response, next) => {
    const { nombre, ciudad, direccion, email } = req.body;
    try {
        const sucursal = await Sucursal.findOne({ nombre, ciudad, direccion, email });

        if (sucursal) {
            return res.status(409).json({
                ok: false,
                message: 'Ya existe una sucursal con esos datos'
            });
        }

        next();
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            message: 'Algo salió mal al verificar la sucursal, intente de nuevo y si el fallo persiste contacte al administrador'
        });
    }
}
