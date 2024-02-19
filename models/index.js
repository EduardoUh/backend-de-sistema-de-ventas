const { Rol } = require('./RolesModel.js');
const { Sucursal } = require('./SucursalesModel.js');
const { Usuario } = require('./UsuariosModel.js');
const { Proveedor } = require('./ProveedoresModel.js');
const { TipoProducto } = require('./TiposProductosModel.js');
const { Producto } = require('./ProductosModel.js');
const { StockProductos } = require('./StockProductosModel.js');
const { Cliente } = require('./ClientesModel.js');
const { Venta } = require('./VentasModel.js');
const { Pago } = require('./PagosModel.js');
const { Compra } = require('./ComprasModel.js');
const { Modulo } = require('./ModulosModel.js');

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
    Pago,
    Compra,
    Modulo
};