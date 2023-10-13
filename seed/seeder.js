require('dotenv').config();
const { connectDb } = require('../db/config.js');
const { Rol, Sucursal, Usuario } = require('../models/index.js');
const { roles } = require('./roles.js');
const { sucursal } = require('./sucursal.js');
const { usuario } = require('./usuario.js');

const importarDatos = async () => {
    try {
        await connectDb();
        const rolesCreados = await Rol.insertMany(roles);
        usuario.rol = rolesCreados[0].id;
        const usuarioCreado = await Usuario.create(usuario);
        sucursal.creador = usuarioCreado.id;
        await Sucursal.insertMany(sucursal);
        console.log('Roles, usuario y sucursal creados exitosamente');
    } catch (error) {
        console.log(error);
        throw new Error('Algo salió mal al intentar importar los datos');
    }
}

importarDatos();
