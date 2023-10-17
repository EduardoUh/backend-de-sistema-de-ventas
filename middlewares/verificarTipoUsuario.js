const { request, response } = require('express');
const { Usuario } = require('../models/index.js');


module.exports.verificarTipoUsuario = async (req = request, res = response, next) => {
    const { uId } = req;
    try {
        const usuario = await Usuario.findById(uId)
            .populate('rol');

        if (!usuario) {
            return res.status(404).json({
                ok: false,
                message: 'Usuario inexistente'
            });
        }

        req.esAdministrador = usuario.rol.rol === 'ADMINISTRADOR' ? true : false;

        next();

    } catch (error) {
        console.log(error);

        if (error.path === '_id') {
            return res.status(400).json({
                ok: false,
                message: 'Id inválido'
            });
        }

        res.status(500).json({
            ok: false,
            message: 'Algo salió mal al verificar el usuario, intente de nuevo y si el fallo persiste contacte al administrador'
        });
    }
}