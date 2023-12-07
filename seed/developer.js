const bcrypt = require('bcrypt');


module.exports.developer = {
    nombres: 'dev',
    apellidoPaterno: 'dev',
    apellidoMaterno: 'dev',
    rol: null,
    email: 'dev@gmail.com',
    password: bcrypt.hashSync('@devPassword', 12),
    creador: '123456789123456789123456',
    fechaCreacion: 123456,
    UltimoEnModificar: '123456789123456789123456',
    fechaUltimaModificacion: 123456
};