const { manejarResultados } = require('./manejarResultados.js');
const { verificarToken } = require('./verificarToken.js');
const { verificarTipoUsuario } = require('./verificarTipoUsuario.js');
const { revisarSucursalYaExiste } = require('./revisarSucursalYaExiste.js');
const { restringirAcceso } = require('./restringirAcceso.js');
const { revisarUsuarioYaExiste } = require('./revisarUsuarioYaExiste.js');

module.exports = {
    manejarResultados,
    verificarToken,
    verificarTipoUsuario,
    revisarSucursalYaExiste,
    restringirAcceso,
    revisarUsuarioYaExiste
};