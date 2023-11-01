const { request, response } = require('express');


module.exports.permitirAdministradores = (req = request, res = response, next) => {
    const { esAdministrador } = req;

    if (!esAdministrador) {
        return res.status(401).json({
            ok: false,
            message: 'Sin las credenciales necesarias para realizar esta acción'
        });
    }

    next();
}