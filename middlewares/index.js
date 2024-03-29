const { manejarResultados } = require('./generales/manejarResultados.js');
const { verificarToken } = require('./generales/verificarToken.js');
const { exponerDatosUsuario } = require('./generales/exponerDatosUsuario.js');
const { revisarSucursalYaExiste } = require('./revisarRecursoYaExiste/revisarSucursalYaExiste.js');
const { verificarUsuarioPerteneceSucursal } = require('./sucursales/verificarUsuarioPerteneceSucursal.js');
const { revisarUsuarioYaExiste } = require('./revisarRecursoYaExiste/revisarUsuarioYaExiste.js');
const { revisarProveedorYaExiste } = require('./revisarRecursoYaExiste/revisarProveedorYaExiste.js');
const { revisarTipoProductoYaExiste } = require('./revisarRecursoYaExiste/revisarTipoProductoYaExiste.js');
const { revisarProductoYaExiste } = require('./revisarRecursoYaExiste/revisarProductoYaExiste.js');
const { revisarStockProductoYaExiste } = require('./revisarRecursoYaExiste/revisarStockProductoYaExiste.js');
const { revisarClienteYaExiste } = require('./revisarRecursoYaExiste/revisarClienteYaExiste.js');
const { verificarPermisosModuloUsuarios } = require('./verificarPermisos/verificarPermisosModuloUsuarios.js');
const { verificarPermisosModuloPerfil } = require('./verificarPermisos/verificarPermisosModuloPerfil.js');
const { verificarPermisosModuloSucursales } = require('./verificarPermisos/verificarPermisosModuloSucursales.js');
const { verificarPermisosModuloRoles } = require('./verificarPermisos/verificarPermisosModuloRoles.js');
const { verificarPermisosModuloProveedores } = require('./verificarPermisos/verificarPermisosModuloProveedores.js');
const { verificarPermisosModuloTiposProductos } = require('./verificarPermisos/verificarPermisosModuloTiposProductos.js');
const { verificarPermisosModuloProductos } = require('./verificarPermisos/verificarPermisosModuloProductos.js');
const { verificarPermisosModuloStock } = require('./verificarPermisos/verificarPermisosModuloStock.js');
const { verificarPermisosModuloClientes } = require('./verificarPermisos/verificarPermisosModuloClientes.js');
const { verificarPermisosModuloCrearVenta } = require('./verificarPermisos/verificarPermisosModuloCrearVenta.js');
const { verificarPermisosModuloVentas } = require('./verificarPermisos/verificarPermisosModuloVentas.js');
const { verificarPermisosModuloPagos } = require('./verificarPermisos/verificarPermisosModuloPagos.js');
const { verificarPermisosModuloCrearCompra } = require('./verificarPermisos/verificarPermisosModuloCrearCompra.js');
const { verificarPermisosModuloCompras } = require('./verificarPermisos/verificarPermisosModuloCompras.js');

module.exports = {
    manejarResultados,
    verificarToken,
    exponerDatosUsuario,
    revisarSucursalYaExiste,
    verificarUsuarioPerteneceSucursal,
    revisarUsuarioYaExiste,
    revisarProveedorYaExiste,
    revisarTipoProductoYaExiste,
    revisarProductoYaExiste,
    revisarStockProductoYaExiste,
    revisarClienteYaExiste,
    verificarPermisosModuloUsuarios,
    verificarPermisosModuloPerfil,
    verificarPermisosModuloSucursales,
    verificarPermisosModuloRoles,
    verificarPermisosModuloProveedores,
    verificarPermisosModuloTiposProductos,
    verificarPermisosModuloProductos,
    verificarPermisosModuloStock,
    verificarPermisosModuloClientes,
    verificarPermisosModuloCrearVenta,
    verificarPermisosModuloVentas,
    verificarPermisosModuloPagos,
    verificarPermisosModuloCrearCompra,
    verificarPermisosModuloCompras
};