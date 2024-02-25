const { request, response } = require('express');


module.exports.verificarPermisosModuloUsuarios = (req = request, res = response, next) => {
    const { modulos, method } = req;

    try {
        const moduloUsuarios = modulos.find(modulo => modulo.nombre === 'USUARIOS');

        if (method === 'POST' && !moduloUsuarios?.permisos?.find(permiso => permiso === 'CREAR')) {
            return res.status(401).json({
                ok: false,
                message: 'Sin las credenciales necesarias para ésta acción'
            });
        }

        if (
            (method === 'GET' && !moduloUsuarios?.permisos?.find(permiso => permiso === 'VER')) &&
            (method === 'GET' && !modulos?.find(modulo => modulo.nombre === 'SUCURSALES')) &&
            (method === 'GET' && !modulos?.find(modulo => modulo.nombre === 'PROVEEDORES')) &&
            (method === 'GET' && !modulos?.find(modulo => modulo.nombre === 'PRODUCTOS')) &&
            (method === 'GET' && !modulos?.find(modulo => modulo.nombre === 'STOCK')) &&
            (method === 'GET' && !modulos?.find(modulo => modulo.nombre === 'COMPRAS')) &&
            (method === 'GET' && !modulos?.find(modulo => modulo.nombre === 'CLIENTES')) &&
            (method === 'GET' && !modulos?.find(modulo => modulo.nombre === 'VENTAS'))
        ) {
            return res.status(401).json({
                ok: false,
                message: 'Sin las credenciales necesarias para ésta acción'
            });
        }

        if (method === 'PUT' && !moduloUsuarios?.permisos?.find(permiso => permiso === 'ACTUALIZAR')) {
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
