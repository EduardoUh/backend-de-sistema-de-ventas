const { Schema, model } = require('mongoose');


const stockProductosSchema = new Schema({
    producto: {
        type: Schema.Types.ObjectId,
        ref: 'Productos',
        required: true
    },
    sucursal: {
        type: Schema.Types.ObjectId,
        ref: 'Sucursales',
        required: true
    },
    existencia: {
        type: Number,
        required: true
    }
});

stockProductosSchema.method('toJSON', function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
});

module.exports.StockProductos = model('StockProductos', stockProductosSchema);
