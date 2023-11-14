const { manejarResultados } = require('./manejarResultados.js');
const { verificarToken } = require('./verificarToken.js');
const { exponerDatosUsuario } = require('./exponerDatosUsuario.js');
const { revisarSucursalYaExiste } = require('./revisarSucursalYaExiste.js');
const { permitirSuperUsuarios } = require('./permitirSuperUsuarios.js');
const { permitirSuperUsuariosYAdministradores } = require('./permitirSuperUsuariosYAdministradores.js');
const { permitirAdministradores } = require('./permitirAdministradores.js');
const { verificarAdministradorPerteneceSucursal } = require('./verificarAdministradorPerteneceSucursal.js');
const { revisarUsuarioYaExiste } = require('./revisarUsuarioYaExiste.js');
const { revisarProveedorYaExiste } = require('./revisarProveedorYaExiste.js');
const { revisarTipoProductoYaExiste } = require('./revisarTipoProductoYaExiste.js');
const { revisarProductoYaExiste } = require('./revisarProductoYaExiste.js');

module.exports = {
    manejarResultados,
    verificarToken,
    exponerDatosUsuario,
    revisarSucursalYaExiste,
    permitirSuperUsuarios,
    permitirSuperUsuariosYAdministradores,
    permitirAdministradores,
    verificarAdministradorPerteneceSucursal,
    revisarUsuarioYaExiste,
    revisarProveedorYaExiste,
    revisarTipoProductoYaExiste,
    revisarProductoYaExiste
};