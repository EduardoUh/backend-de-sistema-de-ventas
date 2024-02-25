const { request, response } = require('express');


module.exports.verificarPermisosModuloRoles = (req = request, res = response, next) => {
    const { modulos, method } = req;

    try {
        const moduloUsuarios = modulos.find(modulo => modulo.nombre === 'USUARIOS');

        if (
            (method === 'GET' && !moduloUsuarios?.permisos?.find(permiso => permiso === 'CREAR')) &&
            (method === 'GET' && !moduloUsuarios?.permisos?.find(permiso => permiso === 'VER'))
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
