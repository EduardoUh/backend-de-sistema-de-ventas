const { request, response } = require('express');
const { startSession } = require('mongoose');
const { transformarDatosPopulatedUsuario, transformarDatosPopulateRol } = require('../helpers/index.js');
const { Venta, Pago } = require('../models/index.js');


module.exports.crearPago = async (req = request, res = response) => {
    const { venta, pagoCon, cantidad, cambio } = req.body;
    const { uId, esAdministrador, esVendedor, sucursalUsuario } = req;
    let session = null;
    try {
        session = await startSession();

        if (cantidad > pagoCon || cambio > pagoCon) {
            return res.status(403).json({
                ok: false,
                message: 'Hay errores en alguno de los siguientes campos: pago con, cantidad, cambio'
            });
        }

        const ventaDb = await Venta.findById(venta).session(session);

        if (!ventaDb) {
            return res.status(404).json({
                ok: false,
                message: 'Venta inexistente'
            });
        }

        if (esAdministrador && sucursalUsuario !== ventaDb.sucursal.toHexString() || esVendedor && sucursalUsuario !== ventaDb.sucursal.toHexString()) {
            return res.status(401).json({
                ok: false,
                message: 'Sin acceso a ésa sucursal'
            });
        }

        if (ventaDb.saldada && ventaDb.saldo === 0) {
            return res.status(409).json({
                ok: false,
                message: 'No se pueden agregar pagos a la venta porque ya se encuentra saldada'
            });
        }

        if (cantidad > ventaDb.saldo) {
            return res.status(403).json({
                ok: false,
                message: 'La cantidad abonada debe ser menor o igual al saldo, no mayor'
            });
        }

        session.startTransaction();

        const pago = new Pago({ venta, creador: uId, fechaCreacion: Date.now(), pagoCon, cantidad, cambio, saldo: (ventaDb.saldo - cantidad) });

        ventaDb.saldo = ventaDb.saldo - cantidad;

        if (ventaDb.saldo === 0) {
            ventaDb.saldada = true;
        }

        await pago.save({ session });

        await ventaDb.save({ session });

        await session.commitTransaction();

        res.status(201).json({
            ok: true,
            message: 'Pago creado correctamente'
        });

    } catch (error) {
        await session.abortTransaction();

        console.log(error);

        res.status(500).json({
            ok: false,
            message: 'Algo salió mal al crear el pago, intente de nuevo y si el fallo persiste contacte al administrador'
        });
    }
    finally {
        await session.endSession();
    }
}

module.exports.ObtenerPagosPorVenta = async (req = request, res = response) => {
    const { id: ventaId } = req.params;
    const { esAdministrador, esVendedor, sucursalUsuario } = req;

    try {
        const venta = await Venta.findById(ventaId);

        if (!venta) {
            return res.status(404).json({
                ok: false,
                message: 'Venta inexistente'
            });
        }

        if (esAdministrador && sucursalUsuario !== venta.sucursal.toHexString() || esVendedor && sucursalUsuario !== venta.sucursal.toHexString()) {
            return res.status(401).json({
                ok: false,
                message: 'Sin acceso a ésa sucursal'
            });
        }

        const pagos = await Pago.find({ venta: ventaId })
            .populate({
                path: 'creador',
                options: {
                    transform: transformarDatosPopulatedUsuario
                },
                populate: {
                    path: 'rol',
                    options: {
                        transform: transformarDatosPopulateRol
                    }
                }
            });

        if (pagos.length === 0) {
            return res.status(404).json({
                ok: false,
                message: 'No se encontraron registros'
            });
        }

        res.status(200).json({
            ok: true,
            pagos
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            ok: false,
            message: 'Algo salió mal al obtener los registros, intente de nuevo y si el fallo persiste contacte al administrador'
        });
    }
}
