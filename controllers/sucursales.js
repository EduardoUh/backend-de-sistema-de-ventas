const { request, response } = require('express');
const { startSession } = require('mongoose');
const { Sucursal } = require('../models/index.js');
const { transformarDatosPopulateRol, filtrarQueryParams, transformarDatosPopulatedUsuario } = require('../helpers/index.js');


module.exports.crearSucursal = async (req = request, res = response) => {
    const { nombre, ciudad, direccion, email } = req.body;
    const { uId } = req;
    let session = null;

    try {
        session = await startSession();

        const sucursal = new Sucursal({ nombre, ciudad, direccion, email, activa: true, creador: uId, fechaCreacion: Date.now(), ultimoEnModificar: uId, fechaUltimaModificacion: Date.now() });

        session.startTransaction();

        await sucursal.save({ session });

        const sucursalCreada = await Sucursal.findById(sucursal.id)
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

        console.log(session?.transaction?.isActive);

        throw new Error('Oops');

        await session.commitTransaction();

        res.status(201).json({
            ok: true,
            message: `Sucursal ${nombre} creada con exito`,
            sucursal: sucursalCreada
        });

    } catch (error) {
        if (session?.transaction?.isActive) {
            await session.abortTransaction();
        }

        console.log(error);

        res.status(500).json({
            ok: false,
            message: 'Algo salió mal al intentar crear una nueva sucursal, intente de nuevo y si el fallo persiste contacte al administrador'
        });
    }
    finally {
        if (session) {
            await session.endSession();
        }
    }
}

module.exports.actualizarSucursal = async (req = request, res = response) => {
    const { nombre, ciudad, direccion, email, activa } = req.body;
    const { id: sucursalId } = req.params;
    const { uId, esAdministrador, sucursalUsuario } = req;
    let session = null;

    try {
        session = await startSession();

        const sucursal = await Sucursal.findById(sucursalId);

        if (!sucursal) {
            return res.status(404).json({
                ok: false,
                message: 'Sucursal no encontrada'
            });
        }

        session.startTransaction();

        await sucursal.updateOne({ nombre, ciudad, direccion, email, activa, ultimoEnModificar: uId, fechaUltimaModificacion: Date.now() }).session(session);

        const sucursalActualizada = await Sucursal.findById(sucursal.id)
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
            message: `La sucursal ${nombre} ha sido actualizada exitosamente`,
            sucursal: sucursalActualizada
        });

    } catch (error) {
        if (session?.transaction?.isActive) {
            await session.abortTransaction();
        }

        console.log(error);

        res.status(500).json({
            ok: false,
            message: 'Algo salió mal al intentar actualizar la sucursal, intente de nuevo y si el fallo persiste contacte al administrador'
        });
    }
    finally {
        if (session) {
            await session.endSession();
        }
    }
}

module.exports.obtenerSucursalPorId = async (req = request, res = response) => {
    const { id: sucursalId } = req.params;

    try {
        const sucursal = await Sucursal.findById(sucursalId)
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

        if (!sucursal) {
            return res.status(404).json({
                ok: false,
                message: 'Sucursal inexistente'
            });
        }

        res.status(200).json({
            ok: true,
            sucursal
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            ok: false,
            message: 'Algo salió mal al intentar consultar la sucursal, intente de nuevo y si el fallo persiste contacte al administrador'
        });
    }
}

module.exports.obtenerSucursales = async (req = request, res = response) => {
    const queryParams = req.query;
    const { esAdministrador, sucursalUsuario } = req;

    try {
        const params = filtrarQueryParams(queryParams, ['nombre', 'ciudad', 'direccion', 'email', 'activa', 'creador', 'fechaCreacion', 'ultimoEnModificar', 'fechaUltimaModificacion']);

        let sucursales = null;

        if (esAdministrador) {
            params._id = sucursalUsuario;
            sucursales = await Sucursal.find(params)
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
            sucursales = await Sucursal.find(params)
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

        if (sucursales.length === 0) {
            return res.status(404).json({
                ok: false,
                message: 'No se encontraron registros'
            });
        }

        res.status(200).json({
            ok: true,
            sucursales
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            ok: false,
            message: 'Algo salió mal al intentar consultar las sucursales, intente de nuevo y si el fallo persiste contacte al administrador'
        });
    }
}
