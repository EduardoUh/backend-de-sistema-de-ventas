const { request, response } = require('express');
const { filtrarQueryParams, transformarDatosPopulatedSucursal, transformarDatosPopulatedUsuario, transformarDatosPopulatedProducto, } = require('../helpers/index.js');
const { Venta, Pago, Sucursal, Cliente, Producto } = require('../models/index.js');


module.exports.crearVenta = async (req = request, res = response) => {
    const { sucursal, cliente, articulos, total, pagoCon, pago, cambio, saldo } = req.body;
    const { uId, esAdministrador, esVendedor, sucursalUsuario } = req;

    try {
        const articulosIds = articulos.map(articulo => articulo.producto);

        const [sucursalDb, clienteDb, articulosDb] = await Promise.all([
            Sucursal.findOne({ _id: sucursal, activa: true }),
            Cliente.findOne({ _id: cliente ? cliente : null, activo: true }),
            Producto.find({ _id: { $in: articulosIds }, activo: true })
        ]);

        if (!sucursalDb || cliente && !clienteDb || articulosDb.length !== articulos.length) {
            return res.status(404).json({
                ok: false,
                message: 'Alguno de los siguientes datos es erroneo sucursal, cliente, articulos'
            });
        }

        // TODO: check if the sucursal retrieved is correct, id is the same and it is active
        // TODO: check if when the cliente is undefined it doesn't return a arbitrary client, because is should not return anything
        // TODO: check if products retrieved are all active and the id is the same

        // const venta = new Venta({ sucursal, creador: uId, cliente, articulos, total, pagoCon, pago, cambio, saldo, saldada: pago === total ? true : false, fechaCreacion: Date.now() });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            ok: false,
            message: 'Algo salió mal al crear la venta, intente de nuevo y si el fallo persiste contacte al administrador'
        });
    }
}
