const bcrypt = require('bcrypt');

module.exports.usuario = {
    nombres: 'admin',
    apellidoPaterno: 'admin',
    apellidoMaterno: 'admin',
    rfc: 'somerfccode',
    rol: null,
    email: 'admin@gmail.com',
    password: bcrypt.hashSync('admin', 12),
    direccion: 'dirección del admin',
    numTelefono: '997-735-84-92',
};