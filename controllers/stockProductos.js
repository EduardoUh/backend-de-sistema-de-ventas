const { request, response } = require('express');
const { Types } = require('mongoose');
const { filtrarQueryParams, transformarDatosPopulatedProducto, transformarDatosPopulatedSucursal, transformarDatosPopulatedUsuario, transformarDatosPopulateRol } = require('../helpers/index.js');
const { Producto, Sucursal, StockProductos } = require('../models/index.js');


module.exports.crearStockProducto = async (req = request, res = response) => {
    const { producto: productoId, sucursal: sucursalId, existencia, precio } = req.body;
    const { uId, esAdministrador, sucursalUsuario } = req;

    try {
        if (esAdministrador && sucursalUsuario !== sucursalId) {
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

        await stockProducto.save();

        res.status(201).json({
            ok: true,
            message: `Producto ${producto.nombre} añadido con éxito al stock de la sucursal ${sucursal.nombre}`
        })

    } catch (error) {
        console.log(error);

        res.status(500).json({
            ok: false,
            message: 'Algo salió mal al crear el stock, intente de nuevo y si el fallo persiste contacte al administrador'
        });
    }
}

module.exports.actualizarStock = async (req = request, res = response) => {
    const { existencia, precio } = req.body;
    const { id: stockId } = req.params;
    const { uId, esAdministrador, sucursalUsuario } = req;

    try {
        const stockProducto = await StockProductos.findById(stockId)
            .populate('sucursal')
            .populate('producto');

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

        if (esAdministrador && sucursalUsuario !== stockProducto.sucursal._id.toHexString()) {
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

        await stockProducto.updateOne({ existencia, precio, ultimoEnModificar: uId, fechaUltimaModificacion: Date.now() });

        res.status(200).json({
            ok: true,
            message: `Stock del producto ${stockProducto.producto.nombre} actualizado con éxito`
        })

    } catch (error) {
        console.log(error);

        res.status(500).json({
            ok: false,
            message: 'Algo salió mal al actualizar el stock, intente de nuevo y si el fallo persiste contacte al administrador'
        });
    }
}

module.exports.obtenerResgistrosStock = async (req = request, res = response) => {
    const queryParams = req.query;
    const { esAdministrador, sucursalUsuario } = req;

    try {
        let stockProductos;

        if (esAdministrador) {
            const params = filtrarQueryParams(queryParams, ['producto', 'existencia', 'precio', 'creador', 'fechaCreacion', 'ultimoEnModificar', 'fechaUltimaModificacion']);

            params.sucursal = sucursalUsuario;

            stockProductos = await StockProductos.find(params)
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
        }
        else {
            const params = filtrarQueryParams(queryParams, ['producto', 'sucursal', 'existencia', 'precio', 'creador', 'fechaCreacion', 'ultimoEnModificar', 'fechaUltimaModificacion']);

            stockProductos = await StockProductos.find(params)
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
        }

        if (stockProductos.length === 0) {
            return res.status(404).json({
                ok: false,
                message: 'No se encontraron registros'
            });
        }

        res.status(200).json({
            ok: true,
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
    const { esAdministrador, esVendedor, sucursalUsuario } = req;

    try {
        if (esAdministrador && sucursalUsuario !== sucursalId || esVendedor && sucursalUsuario !== sucursalId) {
            return res.status(401).json({
                ok: false,
                message: 'Sin acceso a ésa sucursal'
            });
        }

        let stockProductos = await StockProductos.find({ sucursal: sucursalId, existencia: { $gt: 0 } })
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
    const { esAdministrador, sucursalUsuario } = req;

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

        if (esAdministrador && sucursalUsuario !== stock.sucursal.id.toString()) {
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