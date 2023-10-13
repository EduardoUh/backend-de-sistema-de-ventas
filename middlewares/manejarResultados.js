const { validationResult } = require('express-validator');


module.exports.manejarResultados = (req, res, next) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
        return res.status(400).json({
            ok: false,
            errors: result.mapped()
        });
    }
    next();
}