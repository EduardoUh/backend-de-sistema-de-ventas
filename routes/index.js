const { authRouter } = require('./auth.js');
const { sucursalesRouter } = require('./sucursales.js');
const { usuariosRouter } = require('./usuarios.js');
const { rolesRouter } = require('./roles.js');
const { proveedoresRouter } = require('./proveedores.js');

module.exports = {
    authRouter,
    sucursalesRouter,
    usuariosRouter,
    rolesRouter,
    proveedoresRouter
}
