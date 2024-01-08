const { request, response } = require('express');


module.exports.verificarPermisosModuloPerfil = async (req = request, res = response, next) => {
    const { modulos, method } = req;

    try {
        const moduloPerfil = modulos.find(modulo => modulo.nombre === 'PERFIL');

        if (!moduloPerfil) {
            return res.status(401).json({
                ok: false,
                message: 'Sin acceso al módulo de perfil'
            });
        }

        if (method === 'PUT' && !moduloPerfil.permisos.find(permiso => permiso === 'ACTUALIZAR')) {
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
