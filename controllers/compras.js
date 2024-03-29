const { request, response } = require('express');
const { startSession } = require('mongoose');
const { filtrarQueryParams, transformarDatosPopulatedSucursal, transformarDatosPopulatedUsuario, transformarDatosPopulateRol, transformarDatosPopulatedProveedor, transformarDatosPopulatedProducto } = require('../helpers/index.js');
const { Compra, Sucursal, Proveedor, Producto, StockProductos } = require('../models/index.js');


module.exports.crearCompra = async (req = request, res = response) => {
    const { sucursal, proveedor, articulos, total } = req.body;
    const { uId, esSuperUsuario, sucursalUsuario } = req;
    let session = null;

    try {
        session = await startSession();

        if (!esSuperUsuario && sucursalUsuario !== sucursal) {
            return res.status(401).json({
                ok: false,
                message: 'Sin acceso a ésa sucursal'
            });
        }

        const articulosIds = articulos.map(articulo => articulo.producto);

        const [sucursalDb, proveedorDb, articulosDb, stockArticulosDb] = await Promise.all([
            Sucursal.findOne({ _id: sucursal, activa: true }),
            Proveedor.findOne({ _id: proveedor, activo: true }),
            Producto.find({ _id: { $in: articulosIds }, activo: true, proveedor }),
            StockProductos.find({ sucursal, producto: { $in: articulosIds } })
        ]);

        if (!sucursalDb || !proveedorDb || articulosDb.length !== articulosIds.length) {
            return res.status(404).json({
                ok: false,
                message: 'Alguno de los siguientes datos es erroneo o no fué encontrado: sucursal, proveedor, articulos'
            });
        }

        const articulosCrearStock = articulosDb.filter(articuloDb => !stockArticulosDb.find(stockArticuloDb => stockArticuloDb.producto.toHexString() === articuloDb.id));

        const coleccionObjetosArticulosActualizarOCrear = [];

        for (const stockArticuloDb of stockArticulosDb) {
            const articuloDb = articulosDb.find(articuloDb => articuloDb.id === stockArticuloDb.producto.toHexString());
            const articuloRequest = articulos.find(articulo => articulo.producto === stockArticuloDb.producto.toHexString());

            if (articuloDb.ventaPor === 'PIEZA' && articuloRequest.cantidad % 1 > 0) {
                return res.status(403).json({
                    ok: false,
                    message: `El artículo ${articuloDb.nombre} se vende por pieza por lo que no se aceptan existencias con decimales`
                });
            }

            coleccionObjetosArticulosActualizarOCrear.push({
                updateOne: {
                    filter: { _id: stockArticuloDb.id },
                    update: { $inc: { existencia: articuloRequest.cantidad }, precio: articuloRequest.precioVenta, ultimoEnModificar: uId, fechaUltimaModificacion: Date.now() }
                }
            });
        }

        for (const articuloCrearStock of articulosCrearStock) {
            const articuloRequest = articulos.find(articulo => articulo.producto === articuloCrearStock.id);

            if (articuloCrearStock.ventaPor === 'PIEZA' && articuloRequest.cantidad % 1 > 0) {
                return res.status(403).json({
                    ok: false,
                    message: `El artículo ${articuloCrearStock.nombre} se vende por pieza por lo que no se aceptan existencias con decimales`
                });
            }

            coleccionObjetosArticulosActualizarOCrear.push({
                insertOne: {
                    document: { sucursal, producto: articuloCrearStock.id, existencia: articuloRequest.cantidad, precio: articuloRequest.precioVenta, creador: uId, fechaCreacion: Date.now(), ultimoEnModificar: uId, fechaUltimaModificacion: Date.now() }
                }
            });
        }

        const compra = new Compra({ sucursal, creador: uId, proveedor, articulos, total, fechaCreacion: Date.now() });

        session.startTransaction();

        await compra.save({ session });

        await StockProductos.bulkWrite(coleccionObjetosArticulosActualizarOCrear, { session });

        await session.commitTransaction();

        res.status(201).json({
            ok: true,
            message: 'Compra registrada correctamente'
        });

    } catch (error) {
        if (session?.transaction?.isActive) {
            await session.abortTransaction();
        }

        console.log(error);

        res.status(500).json({
            ok: false,
            message: 'Algo salió mal al crear la compra, intente de nuevo y si el fallo persiste contacte al administrador'
        });
    }
    finally {
        if (session) {
            await session.endSession();
        }
    }
}

module.exports.obtenerCompras = async (req = request, res = response) => {
    const queryParams = req.query;
    const { esSuperUsuario, sucursalUsuario } = req;
    const numberPerPage = 10;
    let page = 1;

    try {
        if (!esSuperUsuario && queryParams.sucursal && queryParams.sucursal !== sucursalUsuario) {
            return res.status(401).json({
                ok: false,
                message: 'Sin acceso a ésa sucursal'
            });
        }

        const params = filtrarQueryParams(queryParams, ['sucursal', 'proveedor', 'creador', 'fechaCreacion', 'page']);

        if (!esSuperUsuario) {
            params.sucursal = sucursalUsuario;
        }

        if (params.page) {
            page = params.page;
            delete params.page;
        }

        const count = await Compra.find(params).countDocuments();

        const pagesCanBeGenerated = Math.ceil((count / numberPerPage));

        if (!/^\d*$/.test(page) || page < 1 || page > pagesCanBeGenerated) {
            page = 1;
        }

        const compras = await Compra.find(params)
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
                path: 'proveedor',
                options: {
                    transform: transformarDatosPopulatedProveedor
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
                path: 'articulos.producto',
                options: {
                    transform: transformarDatosPopulatedProducto
                }
            });

        if (compras.length === 0) {
            return res.status(404).json({
                ok: false,
                message: 'No se encontraron registros'
            });
        }

        res.status(200).json({
            ok: true,
            count,
            pagesCanBeGenerated,
            compras
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            ok: false,
            message: 'Algo salió mal al obtener los registros, intente de nuevo y si el fallo persiste contacte al administrador'
        });
    }
}

module.exports.obtenerCompra = async (req = request, res = response) => {
    const { id: compraId } = req.params;
    const { esSuperUsuario, sucursalUsuario } = req;

    try {
        const compra = await Compra.findById(compraId)
            .populate({
                path: 'sucursal',
                options: {
                    transform: transformarDatosPopulatedSucursal
                }
            })
            .populate({
                path: 'proveedor',
                options: {
                    transform: transformarDatosPopulatedProveedor
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
                path: 'articulos.producto',
                options: {
                    transform: transformarDatosPopulatedProducto
                }
            });

        if (!compra) {
            return res.status(404).json({
                ok: false,
                message: 'Compra inexistente'
            });
        }

        if (!esSuperUsuario && sucursalUsuario !== compra.sucursal.id.toHexString()) {
            return res.status(401).json({
                ok: false,
                message: 'Sin acceso a ésa sucursal'
            });
        }

        res.status(200).json({
            ok: true,
            compra
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            ok: false,
            message: 'Algo salió mal al obtener la compra, intente de nuevo y si el fallo persiste contacte al administrador'
        });
    }
}
