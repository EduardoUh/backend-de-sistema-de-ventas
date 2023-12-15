const bcrypt = require('bcrypt');


module.exports.usuario = {
    nombres: 'Super Usuario',
    apellidoPaterno: 'Super Usuario',
    apellidoMaterno: 'Super Usuario',
    rfc: 'rfc',
    rol: null,
    email: 'superusuario@gmail.com',
    password: bcrypt.hashSync('superusuario', 12),
    direccion: 'dirección',
    numTelefono: '997-735-84-92',
    modulos: null,
    creador: '123456789123456789123456',
    fechaCreacion: 123456,
    UltimoEnModificar: '123456789123456789123456',
    fechaUltimaModificacion: 123456
};