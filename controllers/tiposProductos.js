const { request, response } = require('express');
const { startSession } = require('mongoose');
const { filtrarQueryParams, transformarDatosPopulatedUsuario, transformarDatosPopulateRol } = require('../helpers/index.js');
const { TipoProducto } = require('../models/index.js');


module.exports.crearTipoProducto = async (req = request, res = response) => {
    const { tipoProducto, descripcion } = req.body;
    const { uId } = req;
    let session = null;

    try {
        session = await startSession();

        const newTipoProducto = new TipoProducto({ tipoProducto, descripcion, creador: uId, fechaCreacion: Date.now(), ultimoEnModificar: uId, fechaUltimaModificacion: Date.now() });

        session.startTransaction();

        await newTipoProducto.save({ session });

        const tipoProductoCreado = await TipoProducto.findById(newTipoProducto.id)
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
            message: `Tipo de producto ${tipoProducto} creado con éxtito`,
            tipoProducto: tipoProductoCreado
        });

    } catch (error) {
        if (session?.transaction?.isActive) {
            await session.abortTransaction();
        }

        console.log(error);

        res.status(500).json({
            ok: false,
            message: 'Algo salió mal al crear el tipo de producto, intente de nuevo y si el fallo persiste contacte al administrador'
        });
    }
    finally {
        if (session) {
            await session.endSession();
        }
    }
}

module.exports.actualizarTipoProducto = async (req = request, res = response) => {
    const { tipoProducto, descripcion, activo } = req.body;
    const { id: tipoProductoId } = req.params;
    const { uId } = req;
    let session = null;

    try {
        session = await startSession();

        const [tipoProductoEncontrado, tipoProductoPorTipoProducto] = await Promise.all([
            TipoProducto.findById(tipoProductoId),
            TipoProducto.findOne({ tipoProducto })
        ]);

        if (!tipoProductoEncontrado) {
            return res.status(404).json({
                ok: false,
                message: 'Tipo de producto inexistente'
            });
        }

        if (tipoProductoPorTipoProducto && tipoProductoEncontrado.id !== tipoProductoPorTipoProducto.id) {
            return res.status(409).json({
                ok: false,
                message: 'Ya existe ése tipo de producto'
            });
        }

        session.startTransaction();

        await tipoProductoEncontrado.updateOne({ tipoProducto, descripcion, activo, ultimoEnModificar: uId, fechaUltimaModificacion: Date.now() }).session(session);

        const tipoProductoActualizado = await TipoProducto.findById(tipoProductoEncontrado.id)
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
            message: `Tipo de producto ${tipoProducto} actualizado correctamente`,
            tipoProducto: tipoProductoActualizado
        });

    } catch (error) {
        if (session?.transaction?.isActive) {
            await session.abortTransaction();
        }

        console.log(error);

        res.status(500).json({
            ok: false,
            message: 'Algo salió mal al actualizar el tipo de producto, intente de nuevo y si el fallo persiste contacte al administrador'
        });
    }
    finally {
        if (session) {
            await session.endSession();
        }
    }
}

module.exports.obtenerTiposProductos = async (req = request, res = response) => {
    const queryParams = req.query;
    let page = 1;
    const numberPerPage = 10;

    try {
        const params = filtrarQueryParams(queryParams, ['tipoProducto', 'descripcion', 'activo', 'page']);

        if (params.page) {
            page = params.page;
            delete params.page;
        }

        const count = await TipoProducto.find(params).countDocuments();

        const pagesCanBeGenerated = Math.ceil((count / numberPerPage));

        if (!/^\d*$/.test(page) || page < 1 || page > pagesCanBeGenerated) {
            page = 1;
        }

        const tiposProductos = await TipoProducto.find(params)
            .sort({ fechaCreacion: 1 })
            .skip(((page - 1) * numberPerPage))
            .limit(numberPerPage);

        if (tiposProductos.length === 0) {
            return res.status(404).json({
                ok: false,
                message: 'No se encontraron registros'
            });
        }

        res.status(200).json({
            ok: true,
            count,
            pagesCanBeGenerated,
            tiposProductos
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            ok: false,
            message: 'Algo salió mal al obtener los registros, intente de nuevo y si el fallo persiste contacte al administrador'
        });
    }
}

module.exports.obtenerTipoProductoPorId = async (req = request, res = response) => {
    const { id: tipoProductoId } = req.params;

    try {
        const tipoProducto = await TipoProducto.findById(tipoProductoId);

        if (!tipoProducto) {
            return res.status(404).json({
                ok: false,
                message: 'No se encontraron registros'
            });
        }

        res.status(200).json({
            ok: true,
            tipoProducto
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            ok: false,
            message: 'Algo salió mal al obtener el registro, intente de nuevo y si el fallo persiste contacte al administrador'
        });
    }
}
