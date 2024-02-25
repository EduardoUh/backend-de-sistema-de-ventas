const { request, response } = require('express');


module.exports.verificarPermisosModuloClientes = (req = request, res = response, next) => {
    const { modulos, method } = req;

    try {
        const moduloClientes = modulos.find(modulo => modulo.nombre === 'CLIENTES');
        const moduloCrearVenta = modulos.find(modulo => modulo.nombre === 'CREAR VENTA');
        const moduloVentas = modulos.find(modulo => modulo.nombre === 'VENTAS');

        if (!moduloClientes && !moduloCrearVenta) {
            return res.status(401).json({
                ok: false,
                message: 'Sin ácceso al módulo de clientes'
            });
        }

        if (method === 'POST' && !moduloClientes?.permisos?.find(permiso => permiso === 'CREAR')) {
            return res.status(401).json({
                ok: false,
                message: 'Sin las credenciales necesarias para ésta acción'
            });
        }

        if (method === 'PUT' && !moduloClientes?.permisos?.find(permiso => permiso === 'ACTUALIZAR')) {
            return res.status(401).json({
                ok: false,
                message: 'Sin las credenciales necesarias para ésta acción'
            });
        }

        if (
            (method === 'GET' && !moduloClientes?.permisos?.find(permiso => permiso === 'VER')) &&
            (method === 'GET' && !moduloCrearVenta?.permisos?.find(permiso => permiso === 'CREAR')) &&
            (method === 'GET' && !moduloVentas?.permisos?.find(permiso => permiso === 'VER'))
        ) {
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
