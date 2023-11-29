const { Rol } = require('./Roles.js');
const { Sucursal } = require('./Sucursales.js');
const { Usuario } = require('./Usuarios.js');
const { Proveedor } = require('./Proveedores.js');
const { TipoProducto } = require('./TiposProductos.js');
const { Producto } = require('./Productos.js');
const { StockProductos } = require('./StockProductos.js');
const { Cliente } = require('./Clientes.js');
const { Venta } = require('./Ventas.js');
const { Pago } = require('./Pagos.js');

module.exports = {
    Rol,
    Sucursal,
    Usuario,
    Proveedor,
    TipoProducto,
    Producto,
    StockProductos,
    Cliente,
    Venta,
    Pago
};
