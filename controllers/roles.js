const { request, response } = require('express');
const { Rol } = require('../models/index.js');


module.exports.obtenerRoles = async (req = request, res = response) => {
    const { esSuperUsuario } = req;

    try {
        let roles;

        if (esSuperUsuario) {
            roles = await Rol.find({});
        } else {
            roles = await Rol.find({ rol: 'VENDEDOR' });
        }

        if (roles.length === 0) {
            res.status(404).json({
                ok: false,
                message: 'No se encontraron registros'
            });
        }

        res.status(200).json({
            ok: true,
            roles
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            ok: false,
            message: 'Algo salió mal al consultar los roles, intente de nuevo y si el fallo persiste contacte al administrador'
        });
    }
}
