const { request, response } = require('express');


module.exports.verificarPermisosModuloStock = (req = request, res = response, next) => {
    const { modulos, method } = req;

    try {
        const moduloStock = modulos.find(modulo => modulo.nombre === 'STOCK');
        const moduloCrearVenta = modulos.find(modulo => modulo.nombre === 'CREAR VENTA');

        if (!moduloStock && !moduloCrearVenta) {
            return res.status(401).json({
                ok: false,
                message: 'Sin ácceso al módulo de stock'
            });
        }

        if (method === 'POST' && !moduloStock?.permisos?.find(permiso => permiso === 'CREAR')) {
            return res.status(401).json({
                ok: false,
                message: 'Sin las credenciales para ésta acción'
            });
        }

        if (method === 'PUT' && !moduloStock?.permisos?.find(permiso => permiso === 'ACTUALIZAR')) {
            return res.status(401).json({
                ok: false,
                message: 'Sin las credenciales para ésta acción'
            });
        }

        if ((method === 'GET' && !moduloStock?.permisos?.find(permiso => permiso === 'VER')) && (method === 'GET' && !moduloCrearVenta?.permisos?.find(permiso => permiso === 'CREAR'))) {
            return res.status(401).json({
                ok: false,
                message: 'Sin las credenciales para ésta acción'
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
