const { authRouter } = require('./auth.js');
const { sucursalesRouter } = require('./sucursales.js');
const { usuariosRouter } = require('./usuarios.js');
const { rolesRouter } = require('./roles.js');
const { proveedoresRouter } = require('./proveedores.js');
const { tiposProductosRouter } = require('./tiposProductos.js');
const { productosRouter } = require('./productos.js');
const { stockProductoRouter } = require('./stockProductos.js');
const { clientesRouter } = require('./clientes.js');
const { ventasRouter } = require('./ventas.js');
const { pagosRouter } = require('./pagos.js');
const { comprasRouter } = require('./compras.js');

module.exports = {
    authRouter,
    sucursalesRouter,
    usuariosRouter,
    rolesRouter,
    proveedoresRouter,
    tiposProductosRouter,
    productosRouter,
    stockProductoRouter,
    clientesRouter,
    ventasRouter,
    pagosRouter,
    comprasRouter
}
