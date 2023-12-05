const { request, response } = require('express');
const { startSession } = require('mongoose');
const { Usuario, Rol, Sucursal } = require('../models/index.js');
const { hash, compare } = require('bcrypt');
const { transformarDatosPopulateRol, transformarDatosPopulatedSucursal, transformarDatosPopulatedUsuario, filtrarQueryParams } = require('../helpers/index.js');


module.exports.crearUsuario = async (req = request, res = response) => {
    const { body, esAdministrador, sucursalUsuario } = req;
    const { uId } = req;
    let session = null;

    try {
        session = await startSession();

        const promises = [Rol.findById(body.rol)];

        if (body.sucursal) {
            promises.push(Sucursal.findById(body.sucursal));
        }

        const [rol, sucursal] = await Promise.all(promises);

        if (!rol) {
            return res.status(401).json({
                ok: false,
                message: 'Rol inválido'
            });
        }

        if (rol.rol === 'VENDEDOR' && !body.sucursal || rol.rol === 'ADMINISTRADOR' && !body.sucursal) {
            return res.status(401).json({
                ok: false,
                message: 'Es necesario incluir una sucursal para los vendedores o administradores'
            });
        }

        if (esAdministrador && rol.rol !== 'VENDEDOR') {
            return res.status(401).json({
                ok: false,
                message: 'Sin las credenciales necesarias para crear un usuario de ése tipo'
            });
        }

        if (body.sucursal && !sucursal) {
            return res.status(401).json({
                ok: false,
                message: 'Sucursal inválida'
            });
        }

        if (esAdministrador && sucursal.id !== sucursalUsuario) {
            return res.status(401).json({
                ok: false,
                message: 'Sin las credenciales necesarias para asignar ésa sucursal'
            });
        }

        if (rol.rol === 'SUPER USUARIO' && body.sucursal) {
            delete body.sucursal;
        }

        body.password = await hash(body.password, 12);

        const usuario = new Usuario({ ...body, creador: uId, fechaCreacion: Date.now(), ultimoEnModificar: uId, fechaUltimaModificacion: Date.now() });

        session.startTransaction();

        await usuario.save({ session });

        const usuarioCreado = await Usuario.findById(usuario.id)
            .select('-password')
            .populate({
                path: 'sucursal',
                options: {
                    transform: transformarDatosPopulatedSucursal
                }
            })
            .populate({
                path: 'rol',
                options: {
                    transform: transformarDatosPopulateRol
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
            message: `Usuario ${body.nombres} creado con éxito`,
            usuario: usuarioCreado
        });

    } catch (error) {
        if (session.transaction.isActive) {
            await session.abortTransaction();
        }

        console.log(error);

        res.status(500).json({
            ok: false,
            message: 'Algo salió mal al crear el usuario, intente de nuevo y si el fallo persiste contacte al administrador'
        })
    }
    finally {
        if (session) {
            await session.endSession();
        }
    }
}

module.exports.actualizarMiPerfil = async (req = request, res = response) => {
    const { nombres, apellidoPaterno, apellidoMaterno, rfc, email, password, direccion, numTelefono } = req.body;
    const { id } = req.params;
    const { uId } = req;
    let hashedPassword = null;

    try {
        if (uId !== id) {
            return res.status(401).json({
                ok: false,
                message: 'Solo puedes actualizar tu usuario'
            });
        }

        const [usuario, usuarioEmail, usuarioRfc] = await Promise.all([Usuario.findById(id), Usuario.findOne({ email }), Usuario.findOne({ rfc })]);

        if (!usuario) {
            return res.status(404).json({
                ok: false,
                message: 'Usuario no encontrado'
            });
        }

        if (usuarioEmail && usuario.id !== usuarioEmail.id || usuarioRfc && usuario.id !== usuarioRfc.id) {
            return res.status(409).json({
                ok: false,
                message: 'Ya existe un usuario con ése email o rfc'
            });
        }

        if (password) {
            hashedPassword = await hash(password, 12);
        }
        else {
            hashedPassword = usuario.password;
        }

        await usuario.updateOne({ nombres, apellidoPaterno, apellidoMaterno, rfc, email, password: hashedPassword, direccion, numTelefono, ultimoEnModificar: uId, fechaUltimaModificacion: Date.now() });

        res.status(200).json({
            ok: true,
            message: 'Has actualizado tu información correctamente'
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            ok: false,
            message: 'Algo salió mal al actualizar los datos, intente de nuevo y si el fallo persiste contacte al administrador'
        });
    }
}

module.exports.actualizarOtrosPerfiles = async (req = request, res = response) => {
    const { nombres, apellidoPaterno, apellidoMaterno, rfc, rol, sucursal, email, password, direccion, numTelefono, activo } = req.body;
    const { id: usuarioId } = req.params;
    const { uId, esAdministrador, sucursalUsuario } = req;
    let session = null;
    let hashedPassword = null;

    try {
        session = await startSession();

        if (esAdministrador && sucursalUsuario !== sucursal) {
            return res.status(401).json({
                ok: false,
                message: 'Sin las credenciales para asignar ésa sucursal'
            });
        }

        const [usuario, usuarioEmail, usuarioRfc, rolDb, sucursalDb] = await Promise.all([
            Usuario.findById(usuarioId)
                .populate('rol'),
            Usuario.findOne({ email }),
            Usuario.findOne({ rfc }),
            Rol.findById(rol),
            Sucursal.findById(sucursal)
        ]);

        if (!usuario || !rolDb || !sucursalDb) {
            return res.status(404).json({
                ok: false,
                message: 'Usuario, Sucursal o rol no encontrados'
            });
        }

        if (esAdministrador && usuario.rol.rol !== 'VENDEDOR' || esAdministrador && usuario.sucursal.toHexString() !== sucursalUsuario) {
            return res.status(401).json({
                ok: false,
                message: 'Sin las credenciales necesarias para actualizar ése usuario'
            });
        }

        if (esAdministrador && rolDb.rol !== 'VENDEDOR') {
            return res.status(401).json({
                ok: false,
                message: 'Sin las credenciales necesarias para asignar ése rol'
            });
        }

        if (usuarioEmail && usuario.id !== usuarioEmail.id || usuarioRfc && usuario.id !== usuarioRfc.id) {
            return res.status(409).json({
                ok: false,
                message: 'Ya existe un usuario con ése email o rfc'
            });
        }

        if (password) {
            hashedPassword = await hash(password, 12);
        }
        else {
            hashedPassword = usuario.password;
        }

        session.startTransaction();

        await usuario.updateOne({ nombres, apellidoPaterno, apellidoMaterno, rfc, rol, sucursal: rolDb.rol === 'SUPER USUARIO' ? null : sucursal, email, password: hashedPassword, direccion, numTelefono, activo, ultimoEnModificar: uId, fechaUltimaModificacion: Date.now() })
            .session(session);

        const usuarioActualizado = await Usuario.findById(usuario.id)
            .select('-password')
            .populate({
                path: 'sucursal',
                options: {
                    transform: transformarDatosPopulatedSucursal
                }
            })
            .populate({
                path: 'rol',
                options: {
                    transform: transformarDatosPopulateRol
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
            message: `Usuario ${nombres} actualizado correctamente`,
            usuario: usuarioActualizado
        });

    } catch (error) {
        if (session.transaction.isActive) {
            await session.abortTransaction();
        }

        console.log(error);

        res.status(500).json({
            ok: false,
            message: 'Algo salió mal al actualizar el usuario, intente de nuevo y si el fallo persiste contacte al administrador'
        });
    }
    finally {
        if (session) {
            await session.endSession();
        }
    }
}

module.exports.superUsuarioObtenerUsuarios = async (req = request, res = response) => {
    const { query } = req;

    try {
        const queryParameters = filtrarQueryParams(query, ['nombres', 'apellidoPaterno', 'apellidoMaterno', 'rfc', 'email', 'rol', 'sucursal', 'direccion', 'numTelefono']);

        const usuarios = await Usuario.find(queryParameters)
            .select('-password')
            .populate({
                path: 'rol',
                options: {
                    transform: transformarDatosPopulateRol
                }
            })
            .populate({
                path: 'sucursal',
                options: {
                    transform: transformarDatosPopulatedSucursal
                }
            });

        if (usuarios.length === 0) {
            return res.status(404).json({
                ok: false,
                message: 'No se encontraron registros'
            });
        }

        res.status(200).json({
            ok: true,
            usuarios
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            ok: false,
            message: 'Algo salió mal al obtner los usuarios, intente de nuevo y si el fallo persiste contacte al administrador'
        });
    }
}

module.exports.administradorObtenerUsuarios = async (req = request, res = response) => {
    const { query, sucursalUsuario } = req;

    try {
        const queryParameters = filtrarQueryParams(query, ['nombres', 'apellidoPaterno', 'apellidoMaterno', 'rfc', 'email', 'direccion', 'numTelefono']);

        queryParameters.sucursal = sucursalUsuario;

        const usuarios = await Usuario.find(queryParameters)
            .select('-password')
            .populate({
                path: 'rol',
                options: {
                    transform: transformarDatosPopulateRol
                }
            })
            .populate({
                path: 'sucursal',
                options: {
                    transform: transformarDatosPopulatedSucursal
                }
            });

        const filteredUsers = usuarios.filter(usuario => usuario.rol === 'VENDEDOR');

        if (usuarios.length === 0 || filteredUsers.length === 0) {
            return res.status(404).json({
                ok: false,
                message: 'No se encontraron registros'
            });
        }

        res.status(200).json({
            ok: true,
            usuarios: filteredUsers
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            ok: false,
            message: 'Algo salió mal al obtener los vendedores, intente de nuevo y si el fallo persiste contacte al administrador'
        });
    }
}

module.exports.obtenerUsuarioPorId = async (req = request, res = response) => {
    const { id: idUsuario } = req.params;
    const { uId, esAdministrador, sucursalUsuario } = req;

    try {
        let usuario;

        if (esAdministrador) {
            usuario = await Usuario.findOne({ _id: idUsuario, sucursal: sucursalUsuario })
                .select('-password')
                .populate({
                    path: 'rol',
                    options: {
                        transform: transformarDatosPopulateRol
                    }
                })
                .populate({
                    path: 'sucursal',
                    options: {
                        transform: transformarDatosPopulatedSucursal
                    }
                });
        }
        else {
            usuario = await Usuario.findById(idUsuario)
                .select('-password')
                .populate({
                    path: 'rol',
                    options: {
                        transform: transformarDatosPopulateRol
                    }
                })
                .populate({
                    path: 'sucursal',
                    options: {
                        transform: transformarDatosPopulatedSucursal
                    }
                });
        }

        if (!usuario) {
            return res.status(404).json({
                ok: false,
                message: 'Usuario no encontrado'
            });
        }

        if (esAdministrador && usuario.rol !== 'VENDEDOR' && uId !== usuario.id) {
            return res.status(401).json({
                ok: false,
                message: 'Sin acceso a éste usuario'
            });
        }

        res.status(200).json({
            ok: true,
            usuario
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            ok: false,
            message: 'Algo salió mal al obtener el usuario, intente de nuevo y si el fallo persiste contacte al administrador'
        });
    }
}
