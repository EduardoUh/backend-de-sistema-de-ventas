const { request, response } = require('express');


module.exports.verificarPermisosModuloCompras = (req = request, res = response, next) => {
    const { modulos, method } = req;

    try {
        const moduloCompras = modulos.find(modulo => modulo.nombre === 'COMPRAS');

        if (!moduloCompras) {
            return res.status(401).json({
                ok: false,
                message: 'Sin acceso al módulo de compras'
            });
        }

        if (method === 'GET' && !moduloCompras.permisos.find(permiso => permiso === 'VER')) {
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
