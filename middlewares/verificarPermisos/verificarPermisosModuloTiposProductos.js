const { request, response } = require('express');


module.exports.verificarPermisosModuloTiposProductos = (req = request, res = response, next) => {
    const { modulos, method } = req;

    try {
        const moduloTiposProductos = modulos.find(modulo => modulo.nombre === 'TIPOS DE PRODUCTOS');
        const moduloProductos = modulos.find(modulo => modulo.nombre === 'PRODUCTOS');

        if (!moduloTiposProductos && !moduloProductos) {
            return res.status(401).json({
                ok: false,
                message: 'Sin ácceso al módulo de tipos de productos'
            });
        }

        if (method === 'POST' && !moduloTiposProductos?.permisos?.find(permiso => permiso === 'CREAR')) {
            return res.status(401).json({
                ok: false,
                message: 'Sin las credenciales necesarias para ésta acción'
            });
        }

        if (method === 'PUT' && !moduloTiposProductos?.permisos?.find(permiso => permiso === 'ACTUALIZAR')) {
            return res.status(401).json({
                ok: false,
                message: 'Sin las credenciales necesarias para ésta acción'
            });
        }

        if ((method === 'GET' && !moduloTiposProductos?.permisos?.find(permiso => permiso === 'VER')) && (method === 'GET' && !moduloProductos?.permisos?.find(permiso => permiso === 'CREAR'))) {
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
