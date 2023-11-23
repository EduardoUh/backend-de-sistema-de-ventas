const { request, response } = require('express');
const { filtrarQueryParams } = require('../helpers/index.js');
const { Cliente } = require('../models/index.js');


module.exports.crearCliente = async (req = request, res = response) => {
    const { nombres, apellidoPaterno, apellidoMaterno, rfc, email, numTelefono, direccion } = req.body;
    const { uId: usuarioId } = req;

    try {
        const cliente = new Cliente({ nombres, apellidoPaterno, apellidoMaterno, rfc, email, numTelefono, direccion, creador: usuarioId, fechaCreacion: Date.now(), ultimoEnModificar: usuarioId, fechaUltimaModificacion: Date.now() });

        await cliente.save();

        res.status(201).json({
            ok: true,
            message: `Cliente ${nombres} creado con éxito`
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            ok: false,
            message: 'Algo salió mal al crear el cliente, intente de nuevo y si el fallo persiste contacte al administrador'
        });
    }
}
