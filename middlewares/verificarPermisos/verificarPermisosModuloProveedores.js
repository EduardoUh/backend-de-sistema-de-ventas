const { request, response } = require('express');


module.exports.verificarPermisosModuloProveedores = (req = request, res = response, next) => {
    const { modulos, method } = req;

    try {
        const moduloProveedores = modulos.find(modulo => modulo.nombre === 'PROVEEDORES');
        const moduloProductos = modulos.find(modulo => modulo.nombre === 'PRODUCTOS');
        const moduloCrearCompra = modulos.find(modulo => modulo.nombre === 'CREAR COMPRA');
        const moduloCompras = modulos.find(modulo => modulo.nombre === 'COMPRAS');

        if (!moduloProveedores && !moduloProductos && !moduloCrearCompra) {
            return res.status(401).json({
                ok: false,
                message: 'Sin acceso al módulo de proveedores'
            });
        }

        if (method === 'POST' && !moduloProveedores?.permisos?.find(permiso => permiso === 'CREAR')) {
            return res.status(401).json({
                ok: false,
                message: 'Sin las credenciales necesarias para ésta acción'
            });
        }

        if (method === 'PUT' && !moduloProveedores?.permisos?.find(permiso => permiso === 'ACTUALIZAR')) {
            return res.status(401).json({
                ok: false,
                message: 'Sin las credenciales necesarias para ésta acción'
            });
        }

        if (
            (method === 'GET' && !moduloProveedores?.permisos?.find(permiso => permiso === 'VER')) &&
            (method === 'GET' && !moduloProductos) &&
            (method === 'GET' && !moduloCompras) &&
            (method === 'GET' && !moduloCrearCompra?.permisos?.find(permiso => permiso === 'CREAR'))
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