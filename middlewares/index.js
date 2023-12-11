const { manejarResultados } = require('./generales/manejarResultados.js');
const { verificarToken } = require('./generales/verificarToken.js');
const { exponerDatosUsuario } = require('./generales/exponerDatosUsuario.js');
const { revisarSucursalYaExiste } = require('./revisarRecursoYaExiste/revisarSucursalYaExiste.js');
const { permitirSuperUsuarios } = require('./permitirSuperUsuarios.js');
const { permitirSuperUsuariosYAdministradores } = require('./permitirSuperUsuariosYAdministradores.js');
const { permitirAdministradores } = require('./permitirAdministradores.js');
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

module.exports = {
    manejarResultados,
    verificarToken,
    exponerDatosUsuario,
    revisarSucursalYaExiste,
    permitirSuperUsuarios,
    permitirSuperUsuariosYAdministradores,
    permitirAdministradores,
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
    verificarPermisosModuloTiposProductos
};