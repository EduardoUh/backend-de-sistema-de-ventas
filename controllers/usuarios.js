const { request, response } = require('express');
const { Usuario, Rol, Sucursal } = require('../models/index.js');
const { hash, compare } = require('bcrypt');
const { transformarDatosPopulateRol, transformarDatosPopulatedSucursal, filtrarQueryParams } = require('../helpers/index.js');


module.exports.crearUsuario = async (req = request, res = response) => {
    const { body, esAdministrador, sucursalUsuario } = req;

    try {
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

        const usuario = new Usuario(body);

        await usuario.save();

        res.status(201).json({
            ok: true,
            message: `Usuario ${body.nombres} creado con éxito`
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            ok: false,
            message: 'Algo salió mal al crear el usuario, intente de nuevo y si el fallo persiste contacte al administrador'
        })
    }
}

module.exports.actualizarPerfilAdminsVendedores = async (req = request, res = response) => {
    const { nombres, apellidoPaterno, apellidoMaterno, email, password, direccion, numTelefono } = req.body;
    const { id } = req.params;
    const { uId, esAdministrador, esVendedor } = req;
    let hashedPassword;

    try {
        if (uId !== id || !esAdministrador && !esVendedor) {
            return res.status(401).json({
                ok: false,
                message: 'Sin las credenciales necesarias para realizar ésta acción'
            });
        }

        const usuario = await Usuario.findById(uId);

        if (password && typeof password !== 'string' || password && password.length < 5) {
            return res.status(400).json({
                ok: false,
                message: 'La contraseña debe ser una cadena de texto con al menos cinco caracteres'
            });
        }

        if (password) {
            hashedPassword = await hash(password, 12);
        } else {
            hashedPassword = usuario.password;
        }

        await usuario.updateOne({ nombres, apellidoPaterno, apellidoMaterno, email, password: hashedPassword, direccion, numTelefono });

        res.status(200).json({
            ok: true,
            message: `Perfil actualizado correctamente`
        });

    } catch (error) {
        console.log(error);

        if (error.code === 11000) {
            return res.status(409).json({
                ok: false,
                message: 'Ya existe un usuario con ése email'
            });
        }

        res.status(500).json({
            ok: false,
            message: 'Algo salió mal al actualizar el perfil, intente de nuevo y si el fallo persiste contacte al administrador'
        });
    }
}

module.exports.adminActualizaDatosVendedor = async (req = request, res = response) => {
    const { nombres, apellidoPaterno, apellidoMaterno, rfc, email, password, direccion, numTelefono, activo } = req.body;
    const { sucursalUsuario } = req;
    const { id: idVendedor } = req.params;
    let hashedPassword;

    try {
        const vendedor = await Usuario.findById(idVendedor)
            .populate({
                path: 'rol',
                options: {
                    transform: transformarDatosPopulateRol
                }
            });

        if (!vendedor) {
            return res.status(404).json({
                ok: false,
                message: 'Vendedor no encontrado'
            });
        }

        if (vendedor.rol !== 'VENDEDOR') {
            return res.status(401).json({
                ok: false,
                message: 'Sin las credenciales necesarias para actualizar éste usuario'
            });
        }

        if (sucursalUsuario !== vendedor.sucursal.toHexString()) {
            return res.status(401).json({
                ok: false,
                message: 'Sin las credenciales necesarias para actualizar éste vendedor'
            });
        }

        if (password && typeof password !== 'string' || password && password.length < 5) {
            return res.status(400).json({
                ok: false,
                message: 'La contraseña debe ser una cadena de texto con al menos cinco caracteres'
            });
        }

        if (password) {
            hashedPassword = await hash(password, 12);
        } else {
            hashedPassword = vendedor.password;
        }

        await vendedor.updateOne({ nombres, apellidoPaterno, apellidoMaterno, rfc, email, password: hashedPassword, direccion, numTelefono, activo });

        res.status(200).json({
            ok: true,
            message: `Vendedor ${nombres} actualizado correctamente`
        });

    } catch (error) {
        console.log(error);

        if (error.code === 11000) {
            return res.status(409).json({
                ok: false,
                message: 'Ya existe un usuario con ese rfc o email'
            });
        }

        res.status(500).json({
            ok: false,
            message: 'Algo salió mal al actualizar el vendedor, intente de nuevo y si el fallo persiste contacte al administrador'
        });
    }
}

module.exports.actualizarDatosAdminsVendedores = async (req = request, res = response) => {
    const { nombres, apellidoPaterno, apellidoMaterno, rfc, rol, sucursal, email, password, direccion, numTelefono, activo } = req.body;
    const { id: idUsuario } = req.params;
    let hashedPassword;

    try {
        const promises = [
            Usuario.findById(idUsuario),
            Rol.findById(rol),
            Sucursal.findById(sucursal)
        ];

        const [usuario, dbRol, dbSucursal] = await Promise.all(promises);

        if (!usuario) {
            return res.status(404).json({
                ok: false,
                message: 'Usuario no encontrado'
            });
        }

        if (!dbRol) {
            return res.status(401).json({
                ok: false,
                message: 'Rol inválido'
            });
        }

        if (!dbSucursal) {
            return res.status(401).json({
                ok: false,
                message: 'Sucursal Inválida'
            });
        }

        if (password && typeof password !== 'string' || password && password.length < 5) {
            return res.status(400).json({
                ok: false,
                message: 'La contraseña debe ser una cadena de texto con al menos cinco caracteres'
            });
        }

        if (password) {
            hashedPassword = await hash(password, 12);
        } else {
            hashedPassword = usuario.password;
        }

        await usuario.updateOne({ nombres, apellidoPaterno, apellidoMaterno, rfc, rol, sucursal: dbRol.rol === 'SUPER USUARIO' ? null : sucursal, email, password: hashedPassword, direccion, numTelefono, activo });

        res.status(200).json({
            ok: true,
            message: `${dbRol.rol} ${nombres} actualizado correctamente`
        });

    } catch (error) {
        console.log(error);

        if (error.code === 11000) {
            return res.status(409).json({
                ok: false,
                message: 'Ya existe un usuario con ese rfc o email'
            });
        }

        res.status(500).json({
            ok: false,
            message: 'Algo salió mal al actualizar los datos, intente de nuevo y si el fallo persiste contacte al administrador'
        });
    }
}

module.exports.actualizarPerfilSuperUsuario = async (req = request, res = response) => {
    const { nombres, apellidoPaterno, apellidoMaterno, rfc, email, password, direccion, numTelefono } = req.body;
    const { id: idUsuario } = req.params;
    const { uId } = req;
    let hashedPassword;

    try {
        if (uId !== idUsuario) {
            return res.status(401).json({
                ok: false,
                message: 'Sin las credenciales para actualizar ése usuairo'
            });
        }

        const usuario = await Usuario.findById(idUsuario);

        if (!usuario) {
            return res.status(404).json({
                ok: false,
                message: 'Usuario inexistente'
            });
        }

        if (password && typeof password !== 'string' || password && password.length < 5) {
            return res.status(400).json({
                ok: false,
                message: 'La contraseña debe ser una cadena de texto con al menos cinco caracteres'
            });
        }

        if (password) {
            hashedPassword = await hash(password, 12);
        } else {
            hashedPassword = usuario.password;
        }

        await usuario.updateOne({ nombres, apellidoPaterno, apellidoMaterno, rfc, email, password: hashedPassword, direccion, numTelefono });

        res.status(200).json({
            ok: true,
            message: `Super usuario ${nombres} actualizado correctamente`
        });

    } catch (error) {
        console.log(error);

        if (error.code === 11000) {
            return res.status(409).json({
                ok: false,
                message: 'Ya existe un usuario con ese rfc o email'
            });
        }

        res.status(500).json({
            ok: false,
            message: 'Algo salió mal al actualizar los datos, intente de nuevo y si el fallo persiste contacte al administrador'
        });
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
