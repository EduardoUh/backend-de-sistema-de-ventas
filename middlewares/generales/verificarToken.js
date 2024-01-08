const { request, response } = require('express');
const { extraerDatosJwt } = require('../../helpers/index.js');


module.exports.verificarToken = async (req = request, res = response, next) => {
    const token = req.header('x-token');

    if (!token) {
        return res.status(401).json({
            ok: false,
            message: 'El token es requerido'
        });
    }

    try {
        const { uId } = await extraerDatosJwt(token);

        req.uId = uId;

        next();

    } catch (error) {
        console.log(error);
        res.status(401).json({
            ok: false,
            message: 'Token inválido'
        });
    }
}
