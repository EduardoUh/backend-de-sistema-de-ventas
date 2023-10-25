const { request, response } = require('express');
const { Usuario } = require('../models/index.js');


module.exports.exponerDatosUsuario = async (req = request, res = response, next) => {
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

        res.esSuperUsuario = usuario.rol.rol === 'SUPER USUARIO' ? true : false;
        req.esAdministrador = usuario.rol.rol === 'ADMINISTRADOR' ? true : false;
        req.esVendedor = usuario.rol.rol === 'VENDEDOR' ? true : false;
        req.sucursalUsuario = usuario.sucursal ? usuario.sucursal : null;

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
