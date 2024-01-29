const { request, response } = require('express');
const { startSession, isObjectIdOrHexString } = require('mongoose');
const { Usuario, Rol, Sucursal } = require('../models/index.js');
const { hash } = require('bcrypt');
const { transformarDatosPopulateRol, transformarDatosPopulatedSucursal, transformarDatosPopulatedUsuario, filtrarQueryParams } = require('../helpers/index.js');


module.exports.crearUsuario = async (req = request, res = response) => {
    const { body, esSuperUsuario, sucursalUsuario } = req;
    const { uId } = req;
    let session = null;

    try {
        session = await startSession();

        const promises = [Rol.findById(body.rol)];

        if (body.sucursal && isObjectIdOrHexString(body.sucursal)) {
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

        if (!esSuperUsuario && rol.rol !== 'VENDEDOR') {
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

        if (!esSuperUsuario && sucursal.id !== sucursalUsuario) {
            return res.status(401).json({
                ok: false,
                message: 'Sin las credenciales necesarias para asignar ésa sucursal'
            });
        }

        if (rol.rol === 'SUPER USUARIO') {
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
        if (session?.transaction?.isActive) {
            await session.abortTransaction();
        }

        console.log(error);

        res.status(500).json({
            ok: false,
            message: 'Algo salió mal al crear el usuario, intente de nuevo y si el fallo persiste contacte al administrador'
        });
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
    let session = null;

    try {
        session = await startSession();

        if (uId !== id) {
            return res.status(401).json({
                ok: false,
                message: 'Solo puedes actualizar tu usuario'
            });
        }

        const [usuario, usuarioEmail, usuarioRfc] = await Promise.all([
            Usuario.findById(id)
                .populate({
                    path: 'rol',
                    select: 'rol -_id'
                })
                .populate({
                    path: 'sucursal'
                }),
            Usuario.findOne({ email }),
            Usuario.findOne({ rfc })]);

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

        session.startTransaction();

        await usuario.updateOne({ nombres, apellidoPaterno, apellidoMaterno, rfc, email, password: hashedPassword, direccion, numTelefono, ultimoEnModificar: uId, fechaUltimaModificacion: Date.now() }).session(session);

        const updatedUser = await Usuario.findById(id)
            .populate({
                path: 'rol',
                select: 'rol -_id'
            })
            .populate({
                path: 'sucursal'
            }).session(session);

        await session.commitTransaction();

        res.status(200).json({
            ok: true,
            message: 'Has actualizado tu información correctamente',
            usuario: {
                nombres: updatedUser.nombres,
                apellidoPaterno: updatedUser.apellidoPaterno,
                apellidoMaterno: updatedUser.apellidoMaterno,
                email: updatedUser.email,
                rfc: updatedUser.rfc,
                direccion: updatedUser.direccion,
                numTelefono: updatedUser.numTelefono,
                rol: updatedUser.rol.rol,
                id: updatedUser.id,
                sucursalId: updatedUser.sucursal ? updatedUser.sucursal._id.toHexString() : null,
                sucursalNombre: updatedUser.sucursal ? updatedUser.sucursal.nombre : null,
                modulos: updatedUser.modulos
            }
        });

    } catch (error) {
        if (session?.transaction?.isActive) {
            await session.abortTransaction();
        }

        console.log(error);

        res.status(500).json({
            ok: false,
            message: 'Algo salió mal al actualizar los datos, intente de nuevo y si el fallo persiste contacte al administrador'
        });
    }
    finally {
        if (session) {
            await session.endSession();
        }
    }
}

module.exports.actualizarOtrosPerfiles = async (req = request, res = response) => {
    const { nombres, apellidoPaterno, apellidoMaterno, rfc, rol, sucursal, email, password, direccion, numTelefono, activo, modulos } = req.body;
    const { id: usuarioId } = req.params;
    const { uId, esSuperUsuario, sucursalUsuario } = req;
    let session = null;
    let hashedPassword = null;

    try {
        session = await startSession();

        if (uId === usuarioId) {
            return res.status(401).json({
                ok: false,
                message: 'Para actualizar su perfil, diríjase al módulo de perfil'
            });
        }

        if (!esSuperUsuario && sucursalUsuario !== sucursal) {
            return res.status(401).json({
                ok: false,
                message: 'Sin las credenciales para asignar ésa sucursal'
            });
        }

        const promises = [
            Usuario.findById(usuarioId)
                .populate('rol'),
            Usuario.findOne({ email }),
            Usuario.findOne({ rfc }),
            Rol.findById(rol)
        ];

        if (sucursal && isObjectIdOrHexString(sucursal)) {
            promises.push(
                Sucursal.findById(sucursal)
            );
        }

        const [usuario, usuarioEmail, usuarioRfc, rolDb, sucursalDb] = await Promise.all(promises);

        if (!usuario || !rolDb) {
            return res.status(404).json({
                ok: false,
                message: 'Usuario o Sucursal no encontrados'
            });
        }

        if (!esSuperUsuario && !sucursalDb || rolDb.rol !== 'SUPER USUARIO' && !sucursalDb) {
            return res.status(401).json({
                ok: false,
                message: 'La sucursal es requerida'
            });
        }

        if (!esSuperUsuario && usuario.rol.rol !== 'VENDEDOR' || !esSuperUsuario && usuario.sucursal.toHexString() !== sucursalUsuario) {
            return res.status(401).json({
                ok: false,
                message: 'Sin las credenciales necesarias para actualizar ése usuario'
            });
        }

        if (!esSuperUsuario && rolDb.rol !== 'VENDEDOR') {
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

        await usuario.updateOne({ nombres, apellidoPaterno, apellidoMaterno, rfc, rol, sucursal: rolDb.rol === 'SUPER USUARIO' ? null : sucursal, email, password: hashedPassword, direccion, numTelefono, modulos, activo, ultimoEnModificar: uId, fechaUltimaModificacion: Date.now() })
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
        if (session?.transaction?.isActive) {
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

module.exports.obtenerUsuarios = async (req = request, res = response) => {
    const { esSuperUsuario, sucursalUsuario } = req;
    const queryParameters = req.query;
    let count = 0;
    let numberPerPage = 10;
    let page = 1;

    try {
        const params = filtrarQueryParams(queryParameters, [
            'nombres',
            'apellidoPaterno',
            'apellidoMaterno',
            'rfc',
            'rol',
            'sucursal',
            'email',
            'direccion',
            'numTelefono',
            'activo',
            'creador',
            'fechaCreacion',
            'ultimoEnModificar',
            'fechaUltimaModificacion',
            'page'
        ]);

        if (!esSuperUsuario && params?.sucursal && params?.sucursal !== sucursalUsuario) {
            return res.status(401).json({
                ok: false,
                message: 'Sin acceso a ésa sucursal'
            });
        }

        if (!esSuperUsuario) {
            params.sucursal = sucursalUsuario;
        }

        if (params.page) {
            page = params.page;
            delete params.page;
        }

        count = await Usuario.find(params).countDocuments();

        const pagesCanBeGenerated = Math.ceil((count / numberPerPage));

        if (!/^\d*$/.test(page) || page < 1 || page > pagesCanBeGenerated) {
            page = 1;
        }

        const usuarios = await Usuario.find(params)
            .sort({ fechaCreacion: 1 })
            .skip(((page - 1) * numberPerPage))
            .limit(numberPerPage)
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

        if (usuarios.length === 0) {
            return res.status(404).json({
                ok: false,
                message: 'No se encontraron registros'
            });
        }

        res.status(200).json({
            ok: true,
            count,
            pagesCanBeGenerated,
            usuarios
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            ok: false,
            message: 'Algo salió mal al obtener los usuarios, intente de nuevo y si el fallo persiste contacte al administrador'
        });
    }
}

module.exports.obtenerUsuarioPorId = async (req = request, res = response) => {
    const { id: idUsuario } = req.params;
    const { esSuperUsuario, sucursalUsuario } = req;

    try {
        let usuario;

        if (!esSuperUsuario) {
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

        if (!usuario) {
            return res.status(404).json({
                ok: false,
                message: 'Usuario no encontrado'
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
