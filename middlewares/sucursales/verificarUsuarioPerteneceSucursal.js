const { request, response } = require('express');


module.exports.verificarUsuarioPerteneceSucursal = (req = request, res = response, next) => {
    const { esSuperUsuario, sucursalUsuario } = req;
    const { id: idSucursal } = req.params;

    if (!esSuperUsuario && sucursalUsuario !== idSucursal) {
        return res.status(401).json({
            ok: false,
            message: 'Sin acceso a ésta sucursal'
        });
    }

    next();
}
