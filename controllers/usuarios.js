const { request, response } = require('express');
const { Usuario, Rol, Sucursal } = require('../models/index.js');
const { hash, compare } = require('bcrypt');
const { transformarDatosPopulateRol, filtrarQueryParams } = require('../helpers/index.js');


module.exports.crearUsuario = async (req = request, res = response) => {
    const { body } = req;

    try {
        const promises = [Rol.findById(body.rol)];

        if (body.sucursal) {
            promises.push(Sucursal.findById(body.sucursal));
        }

        const [rol, sucursal] = await Promise.all(promises);

        if (!rol) {
            return res.status(401).json({
                ok: false,
                message: 'Rol inválido'
            });
        }

        if (rol.rol === 'VENDEDOR' && !body.sucursal) {
            return res.status(401).json({
                ok: false,
                message: 'Es necesario incluir una sucursal para los vendedores'
            });
        }

        if (body.sucursal && !sucursal) {
            return res.status(401).json({
                ok: false,
                message: 'Sucursal inválida'
            });
        }

        if (rol.rol === 'ADMINISTRADOR' && body.sucursal) {
            delete body.sucursal;
        }

        body.password = await hash(body.password, 12);

        const usuario = new Usuario(body);

        await usuario.save();

        res.status(200).json({
            ok: true,
            message: `Usuario ${body.nombres} creado con exito`
        })

    } catch (error) {
        console.log(error);

        res.status(500).json({
            ok: false,
            message: 'Algo salió mal al crear el usuario, intente de nuevo y si el fallo persiste contacte al administrador'
        })
    }
}
