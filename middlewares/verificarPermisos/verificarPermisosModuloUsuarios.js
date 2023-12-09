const { request, response } = require('express');


module.exports.verificarPermisosModuloUsuarios = (req = request, res = response) => {
    const { modulos, method } = req;

    const moduloUsuarios = modulos.find(modulo => modulo.nombre === 'USUARIOS');

    if (!moduloUsuarios) {
        return res.status(401).json({
            ok: false,
            message: 'Sin acceso al módulo de usuarios'
        });
    }

    if (method === 'POST' && !moduloUsuarios.permisos.find(permiso => permiso === 'CREAR')) {
        return res.status(401).json({
            ok: false,
            message: 'Sin las credenciales necesarias para ésta acción'
        });
    }

    if (method === 'GET' && !moduloUsuarios.permisos.find(permiso => permiso === 'VER')) {
        return res.status(401).json({
            ok: false,
            message: 'Sin las credenciales necesarias para ésta acción'
        });
    }

    if (method === 'PUT' && !moduloUsuarios.permisos.find(permiso => permiso === 'ACTUALIZAR')) {
        return res.status(401).json({
            ok: false,
            message: 'Sin las credenciales necesarias para ésta acción'
        });
    }

    res.status(200).json({
        ok: true,
        message: 'test'
    });
}
