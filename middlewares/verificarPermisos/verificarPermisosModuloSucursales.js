const { request, response } = require('express');


module.exports.verificarPermisosModuloSucursales = (req = request, res = response, next) => {
    const { modulos, method } = req;

    try {
        const moduloSucursales = modulos.find(modulo => modulo.nombre === 'SUCURSALES');

        if (method === 'POST' && !moduloSucursales?.permisos?.find(permiso => permiso === 'CREAR')) {
            return res.status(401).json({
                ok: false,
                message: 'Sin las credenciales necesarias para ésta acción'
            });
        }

        if (method === 'PUT' && !moduloSucursales?.permisos?.find(permiso => permiso === 'ACTUALIZAR')) {
            return res.status(401).json({
                ok: false,
                message: 'Sin las credenciales necesarias para ésta acción'
            });
        }

        if (
            (method === 'GET' && !moduloSucursales?.permisos?.find(permiso => permiso === 'VER')) &&
            (method === 'GET' && !modulos?.find(modulo => modulo.nombre === 'USUARIOS')) &&
            (method === 'GET' && !modulos?.find(modulo => modulo.nombre === 'STOCK')) &&
            (method === 'GET' && !modulos?.find(modulo => modulo.nombre === 'COMPRAS')) &&
            (method === 'GET' && !modulos?.find(modulo => modulo.nombre === 'CREAR COMPRA')) &&
            (method === 'GET' && !modulos?.find(modulo => modulo.nombre === 'CREAR VENTA')) &&
            (method === 'GET' && !modulos?.find(modulo => modulo.nombre === 'VENTAS'))
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
