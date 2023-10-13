const jwt = require('jsonwebtoken');


module.exports.crearJwt = (uId) => {
    if (typeof uId !== 'string' || !uId?.length) throw new Error('El id es requerido para crear el token');
    return new Promise((resolve, reject) => {
        const payload = {
            uId
        };
        if (!process.env.JWT_SECRET) {
            reject('jwt secret es requerido');
        }
        jwt.sign(payload,
            process.env.JWT_SECRET,
            {
                expiresIn: '8h'
            },
            function (err, token) {
                if (err) {
                    reject(err);
                }
                resolve(token);
            }
        );
    });
}
