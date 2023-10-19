const { Sucursal } = require('../models/index.js');
const { request, response } = require('express');


module.exports.crearSucursal = async (req = request, res = response) => {
    const { nombre, ciudad, direccion, email } = req.body;
    const { uId: creador } = req;
    try {
        const sucursal = new Sucursal({ nombre, ciudad, direccion, email, activa: true, creador });
        await sucursal.save();

        res.status(201).json({
            ok: true,
            message: `Sucursal ${nombre} creada con exito`
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            ok: false,
            message: 'Algo salió mal al intentar crear una nueva sucursal, intente de nuevo y si el fallo persiste contacte al administrador'
        });
    }
}

module.exports.actualizarSucursal = async (req = request, res = response) => {
    const { nombre, ciudad, direccion, email, activa } = req.body;
    const { id } = req.params;

    try {
        const sucursal = await Sucursal.findById(id);

        if (!sucursal) {
            return res.status(404).json({
                ok: false,
                message: 'Sucursal no encontrada'
            });
        }

        await sucursal.updateOne({ nombre, ciudad, direccion, email, activa });

        res.status(200).json({
            ok: true,
            message: `La sucursal ${nombre} ha sido actualizada exitosamente`
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            ok: false,
            message: 'Algo salió mal al intentar actualizar la sucursal, intente de nuevo y si el fallo persiste contacte al administrador'
        });
    }
}