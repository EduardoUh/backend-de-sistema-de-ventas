const { request, response } = require('express');
const { Usuario } = require('../models/index.js');


module.exports.permitirSuperUsuariosYAdministradores = async (req = request, res = response, next) => {
    const { esSuperUsuario, esAdministrador } = req;

    if (!esSuperUsuario && !esAdministrador) {
        return res.status(401).json({
            ok: false,
            message: 'Sin las credenciales necesarias para realizar esta acción'
        });
    }

    next();
}
