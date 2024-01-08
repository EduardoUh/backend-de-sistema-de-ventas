const { request, response } = require('express');


module.exports.verificarPermisosModuloProductos = (req = request, res = response, next) => {
    const { modulos, method } = req;

    try {
        const moduloProductos = modulos.find(modulo => modulo.nombre === 'PRODUCTOS');
        const moduloStock = modulos.find(modulo => modulo.nombre === 'STOCK');
        const moduloCrearCompra = modulos.find(modulo => modulo.nombre === 'CREAR COMPRA');

        if (!moduloProductos && !moduloStock && !moduloCrearCompra) {
            return res.status(401).json({
                ok: false,
                message: 'Sin ácceso al módulo de productos'
            });
        }

        if (method === 'POST' && !moduloProductos?.permisos?.find(permiso => permiso === 'CREAR')) {
            return res.status(401).json({
                ok: false,
                message: 'Sin las credenciales para ésta acción'
            });
        }

        if (method === 'PUT' && !moduloProductos?.permisos?.find(permiso => permiso === 'ACTUALIZAR')) {
            return res.status(401).json({
                ok: false,
                message: 'Sin las credenciales para ésta acción'
            });
        }

        if ((method === 'GET' && !moduloProductos?.permisos?.find(permiso => permiso === 'VER')) && (method === 'GET' && !moduloStock?.permisos?.find(permiso => permiso === 'CREAR')) && (method === 'GET' && !moduloCrearCompra?.permisos?.find(permiso => permiso === 'CREAR'))) {
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
