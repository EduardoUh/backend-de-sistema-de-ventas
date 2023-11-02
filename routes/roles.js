const express = require('express');
const { verificarToken, exponerDatosUsuario, permitirSuperUsuariosYAdministradores } = require('../middlewares/index.js');
const { obtenerRoles } = require('../controllers/roles.js');


const rolesRouter = express.Router();

rolesRouter.get('/roles',
    verificarToken,
    exponerDatosUsuario,
    permitirSuperUsuariosYAdministradores,
    obtenerRoles
);

module.exports = {
    rolesRouter
}
