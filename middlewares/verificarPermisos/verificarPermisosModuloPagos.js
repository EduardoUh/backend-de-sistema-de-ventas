const { request, response } = require('express');


module.exports.verificarPermisosModuloPagos = (req = request, res = response, next) => {
    const { modulos, method } = req;

    try {
        const moduloVentas = modulos.find(modulo => modulo.nombre === 'VENTAS');

        if (!moduloVentas) {
            return res.status(401).json({
                ok: false,
                message: 'Sin acceso al módulo de pagos'
            });
        }

        if (method === 'POST' && !moduloVentas.permisos.find(permiso => permiso === 'CREAR PAGO')) {
            return res.status(401).json({
                ok: false,
                message: 'Sin las credenciales necesarias para ésta acción'
            });
        }

        if (method === 'GET' && !moduloVentas.permisos.find(permiso => permiso === 'VER PAGOS')) {
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
