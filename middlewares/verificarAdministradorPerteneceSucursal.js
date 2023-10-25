const { request, response } = require('express');


module.exports.verificarAdministradorPerteneceSucursal = (req = request, res = response, next) => {
    const { esAdministrador, sucursalUsuario } = req;
    const { id: idSucursal } = req.params;

    if (esAdministrador && sucursalUsuario !== idSucursal) {
        return res.status(401).json({
            ok: false,
            message: 'Sin acceso a ésta sucursal'
        });
    }

    next();
}
