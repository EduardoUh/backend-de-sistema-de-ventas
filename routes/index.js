const { authRouter } = require('./auth.js');
const { sucursalesRouter } = require('./sucursales.js');
const { usuariosRouter } = require('./usuarios.js');
const { rolesRouter } = require('./roles.js');

module.exports = {
    authRouter,
    sucursalesRouter,
    usuariosRouter,
    rolesRouter
}
