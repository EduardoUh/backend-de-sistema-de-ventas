const jwt = require('jsonwebtoken');


module.exports.extraerDatosJwt = (token) => {
    return new Promise((resolve, reject) => {
        if (!token || typeof token !== 'string') {
            reject('El token es requerido y debe ser una cadena de texto');
        }
        jwt.verify(token, process.env.JWT_SECRET, function (err, decoded) {
            if (err) {
                reject(err);
            }
            resolve(decoded);
        });
    });
}
