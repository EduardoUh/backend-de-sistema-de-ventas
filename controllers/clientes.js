const { request, response } = require('express');
const { startSession } = require('mongoose');
const { filtrarQueryParams, transformarDatosPopulatedUsuario, transformarDatosPopulateRol } = require('../helpers/index.js');
const { Cliente } = require('../models/index.js');


module.exports.crearCliente = async (req = request, res = response) => {
    const { nombres, apellidoPaterno, apellidoMaterno, rfc, email, numTelefono, direccion } = req.body;
    const { uId: usuarioId } = req;
    let session = null;

    try {
        session = await startSession();

        const cliente = new Cliente({ nombres, apellidoPaterno, apellidoMaterno, rfc, email, numTelefono, direccion, creador: usuarioId, fechaCreacion: Date.now(), ultimoEnModificar: usuarioId, fechaUltimaModificacion: Date.now() });

        session.startTransaction();

        await cliente.save({ session });

        const clienteCreado = await Cliente.findById(cliente.id)
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
            message: `Cliente ${nombres} creado con éxito`,
            cliente: clienteCreado
        });

    } catch (error) {
        if (session?.transaction?.isActive) {
            await session.abortTransaction();
        }

        console.log(error);

        res.status(500).json({
            ok: false,
            message: 'Algo salió mal al crear el cliente, intente de nuevo y si el fallo persiste contacte al administrador'
        });
    }
    finally {
        if (session) {
            await session.endSession();
        }
    }
}

module.exports.actualizarCliente = async (req = request, res = response) => {
    const { nombres, apellidoPaterno, apellidoMaterno, rfc, email, numTelefono, direccion, activo } = req.body;
    const { id: clienteId } = req.params;
    const { uId: usuarioId } = req;
    let session = null;

    try {
        session = await startSession();

        const [clientById, clientByRfc, clientByEmail] = await Promise.all([Cliente.findById(clienteId), Cliente.findOne({ rfc }), Cliente.findOne({ email })]);

        if (clientById === null) {
            return res.status(404).json({
                ok: false,
                message: 'Cliente no encontrado'
            });
        }

        if (clientByRfc !== null && clientById.id !== clientByRfc.id || clientByEmail !== null && clientById.id !== clientByEmail.id) {
            return res.status(409).json({
                ok: false,
                message: 'Ya existe un cliente con ése email o rfc'
            });
        }

        session.startTransaction();

        await clientById.updateOne({ nombres, apellidoPaterno, apellidoMaterno, rfc, email, numTelefono, direccion, activo, ultimoEnModificar: usuarioId, fechaUltimaModificacion: Date.now() }).session(session);

        const clienteActualizado = await Cliente.findById(clientById)
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
            message: `Cliente ${nombres} actualizado con éxito`,
            cliente: clienteActualizado
        })

    } catch (error) {
        if (session?.transaction?.isActive) {
            await session.abortTransaction();
        }

        console.log(error);

        res.status(500).json({
            ok: false,
            message: 'Algo salió mal al actualizar el cliente, intente de nuevo y si el fallo persiste contacte al administador'
        });
    }
    finally {
        if (session) {
            await session.endSession();
        }
    }
}

module.exports.ObtenerClientes = async (req = request, res = response) => {
    const queryParams = req.query;
    const numberPerPage = 10;
    let page = 1;

    try {
        const params = filtrarQueryParams(queryParams, [
            'nombres',
            'apellidoPaterno',
            'apellidoMaterno',
            'rfc',
            'email',
            'numTelefono',
            'activo',
            'creador',
            'fechaCreacion',
            'ultimoEnModificar',
            'fechaUltimaModificacion',
            'page'
        ]);

        if (params.page) {
            page = params.page;
            delete params.page;
        }

        const count = await Cliente.find(params).countDocuments();

        const pagesCanBeGenerated = Math.ceil((count / numberPerPage));

        if (!/^\d*$/.test(page) || page < 1 || page > pagesCanBeGenerated) {
            page = 1;
        }

        const clientes = await Cliente.find(params)
            .sort({ fechaCreacion: 1 })
            .skip(((page - 1) * numberPerPage))
            .limit(numberPerPage)
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

        if (clientes.length === 0) {
            return res.status(404).json({
                ok: false,
                message: 'No se encontraron registros'
            });
        }

        res.status(200).json({
            ok: true,
            count,
            pagesCanBeGenerated,
            clientes
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            ok: false,
            message: 'Algo salió mal al obtener los registros, intente de nuevo y si el fallo persiste contacte al administrador'
        });
    }
}

module.exports.obtenerCliente = async (req = request, res = response) => {
    const { id: clienteId } = req.params;

    try {
        const cliente = await Cliente.findById(clienteId)
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

        if (cliente === null) {
            return res.status(404).json({
                ok: false,
                message: 'Cliente no encontrado'
            });
        }

        res.status(200).json({
            ok: true,
            cliente
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            ok: false,
            message: 'Algo salió mal al obtener el cliente, intente de nuevo y si el fallo persiste contacte al administrador'
        });
    }
}
