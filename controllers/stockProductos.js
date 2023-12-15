const { request, response } = require('express');
const { startSession } = require('mongoose');
const { filtrarQueryParams, transformarDatosPopulatedProducto, transformarDatosPopulatedSucursal, transformarDatosPopulatedUsuario, transformarDatosPopulateRol } = require('../helpers/index.js');
const { Producto, Sucursal, StockProductos } = require('../models/index.js');


module.exports.crearStockProducto = async (req = request, res = response) => {
    const { producto: productoId, sucursal: sucursalId, existencia, precio } = req.body;
    const { uId, esSuperUsuario, sucursalUsuario } = req;
    let session = null;

    try {
        session = await startSession();

        if (!esSuperUsuario && sucursalUsuario !== sucursalId) {
            return res.status(401).json({
                ok: false,
                message: 'Sin acceso a ésta sucursal'
            });
        }

        const [producto, sucursal] = await Promise.all([Producto.findById(productoId), Sucursal.findById(sucursalId)]);

        if (!producto || !sucursal) {
            return res.status(404).json({
                ok: false,
                message: 'Producto o sucursal no encontrados'
            });
        }

        if (!producto.activo || !sucursal.activa) {
            return res.status(403).json({
                ok: false,
                message: 'El producto o la sucursal se encuentran desactivados'
            });
        }

        if (producto.ventaPor === 'PIEZA' && existencia % 1 > 0) {
            return res.status(403).json({
                ok: false,
                message: 'El producto se vende por piezas, por lo que no se aceptan decimales'
            });
        }

        const stockProducto = new StockProductos({ sucursal: sucursalId, producto: productoId, existencia, precio, creador: uId, fechaCreacion: Date.now(), ultimoEnModificar: uId, fechaUltimaModificacion: Date.now() });

        session.startTransaction();

        await stockProducto.save({ session });

        const stockProductoCreado = await StockProductos.findById(stockProducto.id)
            .populate({
                path: 'producto',
                options: {
                    transform: transformarDatosPopulatedProducto
                }
            })
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
                path: 'ultimoEnModificar',
                options: {
                    transform: transformarDatosPopulatedUsuario
                },
                populate: {
                    path: 'rol',
                    options: {
                        transform: transformarDatosPopulateRol
                    }
                }
            }).session(session);

        await session.commitTransaction();

        res.status(201).json({
            ok: true,
            message: `Producto ${producto.nombre} añadido con éxito al stock de la sucursal ${sucursal.nombre}`,
            stockProducto: stockProductoCreado
        });

    } catch (error) {
        if (session?.transaction?.isActive) {
            await session.abortTransaction();
        }

        console.log(error);

        res.status(500).json({
            ok: false,
            message: 'Algo salió mal al crear el stock, intente de nuevo y si el fallo persiste contacte al administrador'
        });
    }
    finally {
        if (session) {
            await session.endSession();
        }
    }
}

module.exports.actualizarStock = async (req = request, res = response) => {
    const { existencia, precio } = req.body;
    const { id: stockId } = req.params;
    const { uId, esSuperUsuario, sucursalUsuario } = req;
    let session = null;

    try {
        session = await startSession();

        const stockProducto = await StockProductos.findById(stockId)
            .populate('sucursal', 'activa ')
            .populate('producto', 'activo ventaPor nombre');

        if (!stockProducto) {
            return res.status(404).json({
                ok: false,
                message: 'Stock no encontrado'
            });
        }

        if (!stockProducto.producto.activo || !stockProducto.sucursal.activa) {
            return res.status(403).json({
                ok: false,
                message: 'El producto o la sucursal se encuentran desactivados'
            });
        }

        if (!esSuperUsuario && sucursalUsuario !== stockProducto.sucursal._id.toHexString()) {
            return res.status(401).json({
                ok: false,
                message: 'Sin acceso a ésta sucursal'
            });
        }

        if (stockProducto.producto.ventaPor === 'PIEZA' && existencia % 1 > 0) {
            return res.status(403).json({
                ok: false,
                message: 'El producto se vende por piezas, por lo que no se aceptan decimales'
            });
        }

        session.startTransaction();

        await stockProducto.updateOne({ existencia, precio, ultimoEnModificar: uId, fechaUltimaModificacion: Date.now() }).session(session);

        const stockProductoActualizado = await StockProductos.findById(stockProducto.id)
            .populate({
                path: 'producto',
                options: {
                    transform: transformarDatosPopulatedProducto
                }
            })
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
                path: 'ultimoEnModificar',
                options: {
                    transform: transformarDatosPopulatedUsuario
                },
                populate: {
                    path: 'rol',
                    options: {
                        transform: transformarDatosPopulateRol
                    }
                }
            }).session(session);

        await session.commitTransaction();

        res.status(200).json({
            ok: true,
            message: `Stock del producto ${stockProducto.producto.nombre} actualizado con éxito`,
            stockProducto: stockProductoActualizado
        })

    } catch (error) {
        if (session?.transaction?.isActive) {
            await session.abortTransaction();
        }

        console.log(error);

        res.status(500).json({
            ok: false,
            message: 'Algo salió mal al actualizar el stock, intente de nuevo y si el fallo persiste contacte al administrador'
        });
    }
    finally {
        if (session) {
            await session.endSession();
        }
    }
}

module.exports.obtenerResgistrosStock = async (req = request, res = response) => {
    const queryParams = req.query;
    const { esSuperUsuario, sucursalUsuario } = req;
    let stockProductos;
    const numberPerPage = 10;
    let page = 1;

    try {
        if (!esSuperUsuario && queryParams.sucursal && queryParams.sucursal !== sucursalUsuario) {
            return res.status(401).json({
                ok: false,
                message: 'Sin ácceso a ésa sucursal'
            });
        }

        const params = filtrarQueryParams(queryParams, ['producto', 'sucursal', 'existencia', 'precio', 'creador', 'fechaCreacion', 'ultimoEnModificar', 'fechaUltimaModificacion', 'page']);

        if (!esSuperUsuario) {
            params.sucursal = sucursalUsuario;
        }

        if (params.page) {
            page = params.page;
            delete params.page;
        }

        const count = await StockProductos.find(params).countDocuments();

        const pagesCanBeGenerated = Math.ceil((count / numberPerPage));

        if (!/^\d*$/.test(page) || page < 1 || page > pagesCanBeGenerated) {
            page = 1;
        }

        stockProductos = await StockProductos.find(params)
            .sort({ fechaCreacion: 1 })
            .skip(((page - 1) * numberPerPage))
            .limit(numberPerPage)
            .populate({
                path: 'producto',
                options: {
                    transform: transformarDatosPopulatedProducto
                }
            })
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
                path: 'ultimoEnModificar',
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

        if (stockProductos.length === 0) {
            return res.status(404).json({
                ok: false,
                message: 'No se encontraron registros'
            });
        }

        res.status(200).json({
            ok: true,
            count,
            pagesCanBeGenerated,
            stockProductos
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            ok: false,
            message: 'Algo salió mal obtener los registros, intente de nuevo y si el fallo persiste contacte al administrador'
        });
    }
}

module.exports.obtenerResgistrosStockParaVenta = async (req = request, res = response) => {
    const { id: sucursalId } = req.params;
    const { esSuperUsuario, sucursalUsuario } = req;
    const numberPerPage = 10;
    let { page } = req.query;

    try {
        if (!esSuperUsuario && sucursalUsuario !== sucursalId) {
            return res.status(401).json({
                ok: false,
                message: 'Sin acceso a ésa sucursal'
            });
        }

        const count = await StockProductos.find({ sucursal: sucursalId, existencia: { $gt: 0 } }).countDocuments();

        const pagesCanBeGenerated = Math.ceil((count / numberPerPage));

        if (!/^\d*$/.test(page) || page < 1 || page > pagesCanBeGenerated) {
            page = 1;
        }

        let stockProductos = await StockProductos.find({ sucursal: sucursalId, existencia: { $gt: 0 } })
            .sort({ fechaCreacion: 1 })
            .skip(((page - 1) * numberPerPage))
            .limit(numberPerPage)
            .select('-creador -fechaCreacion -ultimoEnModificar -fechaUltimaModificacion')
            .populate({
                path: 'producto',
                options: {
                    transform: transformarDatosPopulatedProducto
                }
            })
            .populate({
                path: 'sucursal',
                options: {
                    transform: transformarDatosPopulatedSucursal
                }
            }).exec();

        stockProductos = stockProductos.filter(stockProducto => stockProducto.sucursal.activa && stockProducto.producto.activo);

        if (stockProductos.length === 0) {
            return res.status(404).json({
                ok: false,
                message: 'No se encontraron registros'
            });
        }

        res.status(200).json({
            ok: true,
            count,
            pagesCanBeGenerated,
            stockProductos
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            ok: false,
            message: 'Algo salió mal al obtener los registros, intente de nuevo y si el fallo persiste contacte al administrador'
        });
    }
}

module.exports.obtenerStockPorId = async (req = request, res = response) => {
    const { id: stockId } = req.params;
    const { esSuperUsuario, sucursalUsuario } = req;

    try {
        const stock = await StockProductos.findById(stockId)
            .populate({
                path: 'producto',
                options: {
                    transform: transformarDatosPopulatedProducto
                }
            })
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
                path: 'ultimoEnModificar',
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

        if (!stock) {
            return res.status(404).json({
                ok: false,
                message: 'Stock no encontrado'
            });
        }

        if (!esSuperUsuario && sucursalUsuario !== stock.sucursal.id.toString()) {
            return res.status(401).json({
                ok: false,
                message: 'Sin acceso al stock de ésa sucursal'
            });
        }

        res.status(200).json({
            ok: true,
            stock
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            ok: false,
            message: 'Algo salió mal al obtener el registro, intente de nuevo y si el fallo persiste contacte al administrador'
        })
    }
}