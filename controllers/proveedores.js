const { request, response, json } = require('express');
const { filtrarQueryParams } = require('../helpers/index.js');
const { Proveedor } = require('../models/index.js');


module.exports.crearProveedor = async (req = request, res = response) => {
    const { nombre, direccion, numTelefono, email, rfc } = req.body;

    try {
        const proveedor = new Proveedor({ nombre, direccion, numTelefono, email, rfc });
        await proveedor.save();

        res.status(201).json({
            ok: true,
            message: `Proveedor ${nombre} creado con éxito`
        });

    } catch (error) {
        console.log(error);

        if (error.code === 11000) {
            return res.status(409).json({
                ok: false,
                message: 'Ya existe un proveedor registrado con ese rfc o email'
            });
        }

        res.status(500).json({
            ok: false,
            message: 'Algo salió mal al crear el proveedor, intente de nuevo y si el fallo persiste contacte al administrador'
        });
    }
}

module.exports.actualizarProveedor = async (req = request, res = response) => {
    const { nombre, direccion, numTelefono, email, rfc } = req.body;
    const { id: proveedorId } = req.params;

    try {
        const proveedor = await Proveedor.findById(proveedorId);

        if (!proveedor) {
            return res.status(404).json({
                ok: false,
                message: 'Proveedor inexistente'
            });
        }

        await proveedor.updateOne({ nombre, direccion, numTelefono, email, rfc });

        res.status(200).json({
            ok: true,
            message: `Proveedor ${nombre} actualizado correctamente`
        });

    } catch (error) {
        console.log(error);

        if (error.code === 11000) {
            return res.status(409).json({
                ok: false,
                message: 'Ya existe un proveedor registrado con ese email o rfc'
            });
        }

        res.status(500).json({
            ok: false,
            message: 'Algo salió mal al actualizar el proveedor, intente de nuevo y si el fallo persiste contacte al administrador'
        });
    }
}

module.exports.obtenerProveedores = async (req = request, res = response) => {
    const queryParams = req.query;

    try {
        const params = filtrarQueryParams(queryParams, ['nombre', 'direccion', 'numTelefono', 'email', 'rfc', 'activo']);

        const proveedores = await Proveedor.find(params);

        if (proveedores.length === 0) {
            return res.status(404).json({
                ok: false,
                message: 'No se encontraron registros'
            });
        }

        res.status(200).json({
            ok: true,
            proveedores
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            ok: false,
            message: 'Algo salió mal al obtener los proveedores, intente de nuevo y si el fallo persiste contacte al administrador'
        });
    }
}
