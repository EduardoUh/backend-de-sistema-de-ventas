const express = require('express');
const { verificarToken, exponerDatosUsuario, verificarPermisosModuloRoles } = require('../middlewares/index.js');
const { obtenerRoles } = require('../controllers/roles.js');


const rolesRouter = express.Router();

rolesRouter.get('/roles',
    verificarToken,
    exponerDatosUsuario,
    verificarPermisosModuloRoles,
    obtenerRoles
);

module.exports = {
    rolesRouter
}
