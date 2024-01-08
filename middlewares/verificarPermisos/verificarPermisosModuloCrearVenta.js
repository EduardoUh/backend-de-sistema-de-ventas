const { request, response } = require('express');


module.exports.verificarPermisosModuloCrearVenta = (req = request, res = response, next) => {
    const { modulos, method } = req;

    try {
        const moduloCrearVenta = modulos.find(modulo => modulo.nombre === 'CREAR VENTA');

        if (!moduloCrearVenta) {
            return res.status(401).json({
                ok: false,
                message: 'Sin acceso al módulo de crear venta'
            });
        }

        if (method === 'POST' && !moduloCrearVenta.permisos.find(permiso => permiso === 'CREAR')) {
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
