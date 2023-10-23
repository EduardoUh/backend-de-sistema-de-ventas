const { request, response } = require('express');
const { Usuario } = require('../models/index.js');

module.exports.revisarUsuarioYaExiste = async (req = request, res = response, next) => {
    const { rfc, email } = req.body;

    try {
        const usuario = await Usuario.find().or([{ rfc }, { email }]).exec();

        if (usuario.length > 0) {
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
            message: 'Algo salió mal al verificar el usuario, intente de nuevo y si el fallo persiste contacte al administrador'
        });
    }
}
