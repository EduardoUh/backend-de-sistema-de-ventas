const { authRouter } = require('./auth.js');
const { sucursalesRouter } = require('./sucursales.js');
const { usuariosRouter } = require('./usuarios.js');
const { rolesRouter } = require('./roles.js');
const { proveedoresRouter } = require('./proveedores.js');
const { tiposProductosRouter } = require('./tiposProductos.js');
const { productosRouter } = require('./productos.js');

module.exports = {
    authRouter,
    sucursalesRouter,
    usuariosRouter,
    rolesRouter,
    proveedoresRouter,
    tiposProductosRouter,
    productosRouter
}
