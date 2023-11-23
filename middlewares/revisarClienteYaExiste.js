const { request, response } = require('express');
const { Cliente } = require('../models/index.js');

module.exports.revisarClienteYaExiste = async (req = request, res = response, next) => {
    const { rfc, email } = req.body;

    try {
        const cliente = await Cliente.find().or([{ rfc }, { email }]).exec();

        if (cliente.length > 0) {
            return res.status(409).json({
                ok: false,
                message: 'Ya existe un usuario con esos datos'
            })
        }

        next();

    } catch (error) {
        console.log(error);

        res.status(500).json({
            ok: false,
            message: 'Algo salió mal al verificar el cliente, intente de nuevo y si el fallo persiste contacte al administrador'
        });
    }
}
