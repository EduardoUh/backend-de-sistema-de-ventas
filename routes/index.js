const { authRouter } = require('./auth.js');
const { sucursalesRouter } = require('./sucursales.js');
const { usuariosRouter } = require('./usuarios.js');

module.exports = {
    authRouter,
    sucursalesRouter,
    usuariosRouter
}
