const { request, response } = require('express');
const { Proveedor } = require('../models/index.js');


module.exports.revisarProveedorYaExiste = async (req = request, res = response, next) => {
    const { nombre, direccion, numTelefono, email, rfc } = req.body;

    try {
        const proveedor = await Proveedor.findOne({ nombre, direccion, numTelefono, email, rfc });

        if (proveedor) {
            return res.status(409).json({
                ok: false,
                message: 'Ya existe un proveedor con esos datos'
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
