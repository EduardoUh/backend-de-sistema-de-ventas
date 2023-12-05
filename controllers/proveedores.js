const { request, response } = require('express');
const { startSession } = require('mongoose');
const { filtrarQueryParams, transformarDatosPopulatedUsuario, transformarDatosPopulateRol } = require('../helpers/index.js');
const { Proveedor } = require('../models/index.js');


module.exports.crearProveedor = async (req = request, res = response) => {
    const { nombre, direccion, numTelefono, email, rfc } = req.body;
    const { uId } = req;
    let session = null;

    try {
        session = await startSession();

        const proveedorYaExiste = await Proveedor.findOne().or([{ rfc }, { email }]).exec();

        if (proveedorYaExiste) {
            return res.status(409).json({
                ok: false,
                message: 'Ya existe un proveedor registrado con ese rfc o email'
            })
        }

        const proveedor = new Proveedor({ nombre, direccion, numTelefono, email, rfc, creador: uId, fechaCreacion: Date.now(), ultimoEnModificar: uId, fechaUltimaModificacion: Date.now() });

        session.startTransaction();

        await proveedor.save({ session });

        const proveedorCreado = await Proveedor.findById(proveedor.id)
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
            message: `Proveedor ${nombre} creado con éxito`,
            proveedor: proveedorCreado
        });

    } catch (error) {
        if (session?.transaction?.isActive) {
            await session.abortTransaction();
        }

        console.log(error);

        res.status(500).json({
            ok: false,
            message: 'Algo salió mal al crear el proveedor, intente de nuevo y si el fallo persiste contacte al administrador'
        });
    }
    finally {
        if (session) {
            await session.endSession();
        }
    }
}

module.exports.actualizarProveedor = async (req = request, res = response) => {
    const { nombre, direccion, numTelefono, email, rfc, activo } = req.body;
    const { id: proveedorId } = req.params;
    const { uId } = req;
    let session = null;

    try {
        session = await startSession();

        const [proveedor, proveedorEmail, proveedorRfc] = await Promise.all([
            Proveedor.findById(proveedorId),
            Proveedor.findOne({ email }),
            Proveedor.findOne({ rfc })
        ]);

        if (!proveedor) {
            return res.status(404).json({
                ok: false,
                message: 'Proveedor no encontrado'
            });
        }

        if (proveedorEmail && proveedor.id !== proveedorEmail.id || proveedorRfc && proveedor.id !== proveedorRfc.id) {
            return res.status(409).json({
                ok: false,
                message: 'Ya existe un proveedor con ése email o rfc'
            });
        }

        session.startTransaction();

        await proveedor.updateOne({ nombre, direccion, numTelefono, email, rfc, activo, ultimoEnModificar: uId, fechaUltimaModificacion: Date.now() }).session(session);

        const proveedorActualizado = await Proveedor.findById(proveedor.id)
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
            message: `Proveedor ${nombre} actualizado correctamente`,
            proveedor: proveedorActualizado
        });

    } catch (error) {
        if (session?.transaction?.isActive) {
            await session.abortTransaction();
        }

        console.log(error);

        res.status(500).json({
            ok: false,
            message: 'Algo salió mal al actualizar el proveedor, intente de nuevo y si el fallo persiste contacte al administrador'
        });
    }
    finally {
        if (session) {
            await session.endSession();
        }
    }
}

module.exports.obtenerProveedores = async (req = request, res = response) => {
    const queryParams = req.query;

    try {
        const params = filtrarQueryParams(queryParams, ['nombre', 'direccion', 'numTelefono', 'email', 'rfc', 'activo', 'creador', 'ultimoEnModificar', 'fechaCreacion', 'fechaUltimaModificacion']);

        const proveedores = await Proveedor.find(params)
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

module.exports.obtenerProveedorPorId = async (req = request, res = response) => {
    const { id: proveedorId } = req.params;

    try {
        const proveedor = await Proveedor.findById(proveedorId)
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

        if (!proveedor) {
            return res.status(404).json({
                ok: false,
                message: 'Proveedor inexistente'
            });
        }

        res.status(200).json({
            ok: true,
            proveedor
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            ok: false,
            message: 'Algo salió mal al obtener el proveedor, intente de nuevo y si el fallo persiste contacte al administrador'
        });
    }
}
