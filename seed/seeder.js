require('dotenv').config();
const { startSession, disconnect, connection } = require('mongoose');
const { connectDb } = require('../db/config.js');
const { Rol, Sucursal, Usuario, Modulo } = require('../models/index.js');
const { roles } = require('./roles.js');
const { sucursal } = require('./sucursal.js');
const { usuario } = require('./usuario.js');
const { modulos } = require('./modulos.js');

const importarDatos = async () => {
    let session = null;

    try {
        await connectDb();

        session = await startSession();

        session.startTransaction();

        const modulosCreados = await Modulo.insertMany(modulos, { session });

        usuario.modulos = modulosCreados;

        const rolesCreados = await Rol.insertMany(roles, { session });

        const superUsuarioRol = rolesCreados.find(rolCreado => rolCreado.rol === 'SUPER USUARIO');

        usuario.rol = superUsuarioRol.id;

        const usuarioCreado = new Usuario(usuario);

        usuarioCreado.creador = usuarioCreado.id;
        usuarioCreado.fechaCreacion = Date.now();
        usuarioCreado.ultimoEnModificar = usuarioCreado.id;
        usuarioCreado.fechaUltimaModificacion = Date.now();

        await usuarioCreado.save({ session });

        sucursal.creador = usuarioCreado.id;
        sucursal.fechaCreacion = Date.now();
        sucursal.ultimoEnModificar = usuarioCreado.id;
        sucursal.fechaUltimaModificacion = Date.now();

        const sucursalCreada = new Sucursal(sucursal);

        await sucursalCreada.save({ session });

        await session.commitTransaction();

        console.log('Modulos, roles, usuario y sucursal creados exitosamente');

    } catch (error) {
        if (session?.transaction?.isActive) {
            await session.abortTransaction();
        }

        console.log(error);

        throw new Error('Algo salió mal al intentar importar los datos');
    }
    finally {
        if (session) {
            await session.endSession();
        }
        if (connection.readyState === 1) {
            await disconnect();
        }
    }
}

importarDatos();
