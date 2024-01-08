const { request, response } = require('express');


module.exports.verificarPermisosModuloSucursales = (req = request, res = response, next) => {
    const { modulos, method } = req;

    try {
        const moduloSucursales = modulos.find(modulo => modulo.nombre === 'SUCURSALES');

        if (!moduloSucursales) {
            return res.status(401).json({
                ok: false,
                message: 'Sin acceso al módulo de sucursales'
            });
        }

        if (method === 'POST' && !moduloSucursales.permisos.find(permiso => permiso === 'CREAR')) {
            return res.status(401).json({
                ok: false,
                message: 'Sin las credenciales necesarias para ésta acción'
            });
        }

        if (method === 'PUT' && !moduloSucursales.permisos.find(permiso => permiso === 'ACTUALIZAR')) {
            return res.status(401).json({
                ok: false,
                message: 'Sin las credenciales necesarias para ésta acción'
            });
        }

        if (method === 'GET' && !moduloSucursales.permisos.find(permiso => permiso === 'VER')) {
            return res.status(401).json({
                ok: false,
                message: 'Sin las credenciales necesarias para ésta acción'
            });
        }

        next();

    } catch (error) {
        console.log(error);

        res.status(500).json({
            ok: false,
            message: 'Algo salió mal al verificar los permisos, intente de nuevo y si el fallo persiste contacte al administrador'
        });
    }
}
