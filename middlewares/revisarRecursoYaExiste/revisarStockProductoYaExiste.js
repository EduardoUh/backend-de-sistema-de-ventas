const { request, response } = require('express');
const { StockProductos } = require('../../models/index.js');


module.exports.revisarStockProductoYaExiste = async (req = request, res = response, next) => {
    const { producto, sucursal } = req.body;

    try {
        const stockProductoExiste = await StockProductos.findOne({ producto, sucursal });

        if (stockProductoExiste) {
            return res.status(409).json({
                ok: false,
                message: 'El producto ya está en el stock de esa sucursal'
            });
        }

        next();

    } catch (error) {
        console.log(error);

        res.status(500).json({
            ok: false,
            message: 'Algo salió mal al verificar el producto, intente de nuevo y si el fallo persiste contacte al administrador'
        });
    }
}
