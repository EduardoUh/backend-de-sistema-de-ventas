const { request, response } = require('express');


module.exports.permitirSuperUsuarios = (req = request, res = response, next) => {
    const { esSuperUsuario } = req;

    if (!esSuperUsuario) {
        return res.status(401).json({
            ok: false,
            message: 'Sin las credenciales necesarias para realizar esta acción'
        });
    }

    next();
}