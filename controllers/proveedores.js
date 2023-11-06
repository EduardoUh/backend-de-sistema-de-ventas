const { request, response } = require('express');
const { Proveedor } = require('../models/index.js');


module.exports.crearProveedor = async (req = request, res = response) => {
    const { nombre, direccion, numTelefono, email, rfc } = req.body;

    try {
        const proveedor = new Proveedor({ nombre, direccion, numTelefono, email, rfc });
        await proveedor.save();

        res.status(201).json({
            ok: true,
            message: `Sucursal ${nombre} creada con éxito`
        });

    } catch (error) {
        console.log(error);

        if (error.code === 11000) {
            return res.status(409).json({
                ok: false,
                message: 'Ya existe un proveedor registrado con ese rfc o email'
            });
        }

        res.status(500).json({
            ok: false,
            message: 'Algo salió mal al crear el proveedor, intente de nuevo y si el fallo persiste contacte al administrador'
        });
    }
}
