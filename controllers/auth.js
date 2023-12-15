const { request, response } = require('express');
const { compare } = require('bcrypt');
const { Usuario } = require('../models/index.js');
const { crearJwt, extraerDatosJwt } = require('../helpers/index.js');


module.exports.login = async (req = request, res = response) => {
    const { email, password } = req.body;
    try {
        const usuario = await Usuario.findOne({ email, activo: true })
            .populate({
                path: 'rol',
                select: 'rol -_id'
            })
            .populate({
                path: 'sucursal'
            });

        if (!usuario) {
            return res.status(401).json({
                ok: false,
                message: 'Usuario inválido'
            });
        }

        if (usuario.sucursal?.activa === false) {
            return res.status(401).json({
                ok: false,
                message: 'Tú sucursal se encuentra desactivada'
            });
        }

        const coinciden = await compare(password, usuario.password);

        if (!coinciden) {
            return res.status(401).json({
                ok: false,
                message: 'Contraseña inválida'
            });
        }

        const token = await crearJwt(usuario.id);
        const { iat, exp } = await extraerDatosJwt(token);

        res.status(200).json({
            ok: true,
            usuario: {
                nombres: usuario.nombres,
                apellidoPaterno: usuario.apellidoPaterno,
                apellidoMaterno: usuario.apellidoMaterno,
                email: usuario.email,
                rfc: usuario.rfc,
                direccion: usuario.direccion,
                numTelefono: usuario.numTelefono,
                rol: usuario.rol.rol,
                id: usuario.id,
                sucursalId: usuario.sucursal ? usuario.sucursal._id.toHexString() : null,
                sucursalNombre: usuario.sucursal ? usuario.sucursal.nombre : null
            },
            token,
            fechaCreacionToken: `${new Date(iat * 1000).getDate()}/${new Date(iat * 1000).getMonth() + 1}/${new Date(iat * 1000).getHours()}:${new Date(iat * 1000).getMinutes()}`,
            fechaExpiracionToken: `${new Date(exp * 1000).getDate()}/${new Date(exp * 1000).getMonth() + 1}/${new Date(exp * 1000).getHours()}:${new Date(exp * 1000).getMinutes()}`
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            ok: false,
            message: 'Algo salió mal al autenticarse, intente de nuevo y si el fallo persiste contacte al administrador'
        });
    }
}

module.exports.renovarToken = async (req = request, res = response) => {
    const { uId } = req;
    try {
        const usuario = await Usuario.findById(uId)
            .populate({
                path: 'rol',
                select: 'rol -_id'
            })
            .populate({
                path: 'sucursal'
            });

        if (!usuario) {
            return res.status(401).json({
                ok: false,
                message: 'Usuario inválido'
            });
        }

        if (usuario.sucursal?.activa === false) {
            return res.status(401).json({
                ok: false,
                message: 'Tú sucursal se encuentra desactivada'
            });
        }

        const token = await crearJwt(uId);
        const { iat, exp } = await extraerDatosJwt(token);

        res.status(200).json({
            ok: true,
            usuario: {
                nombres: usuario.nombres,
                apellidoPaterno: usuario.apellidoPaterno,
                apellidoMaterno: usuario.apellidoMaterno,
                email: usuario.email,
                rfc: usuario.rfc,
                direccion: usuario.direccion,
                numTelefono: usuario.numTelefono,
                rol: usuario.rol.rol,
                id: usuario.id,
                sucursalId: usuario.sucursal ? usuario.sucursal._id.toHexString() : null,
                sucursalNombre: usuario.sucursal ? usuario.sucursal.nombre : null
            },
            token,
            fechaCreacionToken: `${new Date(iat * 1000).getDate()}/${new Date(iat * 1000).getMonth() + 1}/${new Date(iat * 1000).getHours()}:${new Date(iat * 1000).getMinutes()}`,
            fechaExpiracionToken: `${new Date(exp * 1000).getDate()}/${new Date(exp * 1000).getMonth() + 1}/${new Date(exp * 1000).getHours()}:${new Date(exp * 1000).getMinutes()}`
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            ok: false,
            message: 'Algo salió mal al renovar el token, intente de nuevo y si el fallo persiste contacte al administrador'
        });
    }
}
