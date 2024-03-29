const { request, response } = require('express');
const { isObjectIdOrHexString, startSession } = require('mongoose');
const { filtrarQueryParams, transformarDatosPopulatedSucursal, transformarDatosPopulatedUsuario, transformarDatosPopulateRol, transformarDatosPopulatedProducto, transformarDatosPopulatedCliente } = require('../helpers/index.js');
const { Venta, Pago, Sucursal, Cliente, Producto, StockProductos } = require('../models/index.js');


module.exports.crearVenta = async (req = request, res = response) => {
    const { sucursal, cliente, articulos, total, pagoCon, pago, cambio, saldo } = req.body;
    const { uId, esSuperUsuario, sucursalUsuario } = req;
    let session = null;

    try {
        session = await startSession();

        if (!esSuperUsuario && sucursalUsuario !== sucursal) {
            return res.status(401).json({
                ok: false,
                message: 'Sin las credenciales necesarias para acceder a ésta sucursal'
            });
        }

        if (pago > pagoCon || cambio > pagoCon || pago > total || saldo > total) {
            return res.status(403).json({
                ok: false,
                message: 'Hay errores en alguno de los siguientes campos: pago con, pago, cambio'
            });
        }

        if (cliente && !isObjectIdOrHexString(cliente)) {
            return res.status(400).json({
                ok: false,
                message: 'Campo cliente es inválido'
            });
        }

        const articulosIds = articulos.map(articulo => articulo.producto);

        const [sucursalDb, clienteDb, articulosDb, stockProductos] = await Promise.all([
            Sucursal.findOne({ _id: sucursal, activa: true }),
            Cliente.findOne({ _id: cliente, activo: true }),
            Producto.find({ _id: { $in: articulosIds }, activo: true }),
            StockProductos.find({ sucursal: sucursal, producto: { $in: articulosIds }, existencia: { $gt: 0 } })
        ]);

        if (!sucursalDb || cliente && !clienteDb || articulosDb.length !== articulos.length || stockProductos.length !== articulos.length) {
            return res.status(404).json({
                ok: false,
                message: 'Alguno de los siguientes datos es erroneo sucursal, cliente, articulos'
            });
        }

        if (!clienteDb && pago < total) {
            return res.status(400).json({
                ok: false,
                message: 'Únicamente los clientes registrados pueden tener crédito'
            });
        }

        const collectionOfStockToUpdate = [];

        for (const stockProducto of stockProductos) {
            const articulo = articulos.find(articulo => articulo.producto === stockProducto.producto.toHexString());
            const articuloDb = articulosDb.find(articuloDb => articuloDb.id === stockProducto.producto.toHexString());

            if (articuloDb.ventaPor === 'PIEZA' && articulo.cantidad % 1 > 0) {
                return res.status(403).json({
                    ok: false,
                    message: `El artículo ${articuloDb.nombre} se vende por piezas, no por kilogramo`
                });
            }

            if (stockProducto.existencia - articulo.cantidad < 0) {
                return res.status(409).json({
                    ok: false,
                    message: `La existencia del producto ${articuloDb.nombre} es insuficiente para satisfacer la orden`
                });
            }

            collectionOfStockToUpdate.push({
                updateOne: {
                    filter: { _id: stockProducto.id },
                    update: { $inc: { existencia: -(articulo.cantidad) } }
                }
            });
        }
        const nuevaVenta = new Venta({ sucursal, creador: uId, cliente, articulos, total, pagoCon, pago, cambio, saldo, saldada: pago === total ? true : false, fechaCreacion: Date.now() });

        const pagoARegistrar = new Pago({ venta: nuevaVenta.id, creador: uId, fechaCreacion: nuevaVenta.fechaCreacion, pagoCon, cantidad: pago, cambio, saldo });

        session.startTransaction();

        await nuevaVenta.save({ session });

        await pagoARegistrar.save({ session });

        await StockProductos.bulkWrite(collectionOfStockToUpdate, { session });

        await session.commitTransaction();

        res.status(201).json({
            ok: true,
            message: 'Venta registrada correctamente'
        });

    } catch (error) {
        if (session?.transaction?.isActive) {
            await session.abortTransaction();
        }

        console.log(error);

        res.status(500).json({
            ok: false,
            message: 'Algo salió mal al crear la venta, intente de nuevo y si el fallo persiste contacte al administrador'
        });
    }
    finally {
        if (session) {
            await session.endSession();
        }
    }
}

module.exports.obtenerVentas = async (req = request, res = response) => {
    const queryParams = req.query;
    const { esSuperUsuario, sucursalUsuario } = req;
    const numberPerPage = 10;
    let page = 1;

    try {
        if (!esSuperUsuario && queryParams?.sucursal && queryParams.sucursal !== sucursalUsuario) {
            return res.status(401).json({
                ok: false,
                message: 'Sin acceso a ésa sucursal'
            });
        }

        const params = filtrarQueryParams(queryParams, ['sucursal', 'creador', 'cliente', 'saldada', 'fechaCreacion', 'page']);

        if (!esSuperUsuario) {
            params.sucursal = sucursalUsuario;
        }

        if (params.page) {
            page = params.page;
            delete params.page;
        }

        const count = await Venta.find(params).countDocuments();

        const pagesCanBeGenerated = Math.ceil((count / numberPerPage));

        if (!/^\d*$/.test(page) || page < 1 || page > pagesCanBeGenerated) {
            page = 1;
        }

        const ventas = await Venta.find(params)
            .sort({ fechaCreacion: 1 })
            .skip(((page - 1) * numberPerPage))
            .limit(numberPerPage)
            .populate({
                path: 'sucursal',
                options: {
                    transform: transformarDatosPopulatedSucursal
                }
            })
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
            })
            .populate({
                path: 'cliente',
                options: {
                    transform: transformarDatosPopulatedCliente
                }
            })
            .populate({
                path: 'articulos.producto',
                options: {
                    transform: transformarDatosPopulatedProducto
                }
            });

        if (ventas.length === 0) {
            return res.status(404).json({
                ok: false,
                message: 'No se encontraron registros'
            });
        }

        res.status(200).json({
            ok: true,
            count,
            pagesCanBeGenerated,
            ventas
        })

    } catch (error) {
        console.log(error);

        res.status(500).json({
            ok: false,
            message: 'Algo salió mal al obtener los registros, intente de nuevo y si el fallo persiste contacte al administrador'
        });
    }
}

module.exports.obtenerVenta = async (req = request, res = response) => {
    const { id: ventaId } = req.params;
    const { esSuperUsuario, sucursalUsuario } = req;

    try {
        const venta = await Venta.findById(ventaId)
            .populate({
                path: 'sucursal',
                options: {
                    transform: transformarDatosPopulatedSucursal
                }
            })
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
            })
            .populate({
                path: 'cliente',
                options: {
                    transform: transformarDatosPopulatedCliente
                }
            })
            .populate({
                path: 'articulos.producto',
                options: {
                    transform: transformarDatosPopulatedProducto
                }
            });

        if (!venta) {
            return res.status(404).json({
                ok: false,
                message: 'Venta inexistente'
            });
        }

        if (!esSuperUsuario && sucursalUsuario !== venta.sucursal.id.toHexString()) {
            return res.status(401).json({
                ok: false,
                message: 'Sin acceso a ésa sucursal'
            });
        }

        res.status(200).json({
            ok: true,
            venta
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            ok: false,
            message: 'Algo salió mal al obtener la venta, intente de nuevo y si el fallo persiste contacte al administrador'
        });
    }
}
