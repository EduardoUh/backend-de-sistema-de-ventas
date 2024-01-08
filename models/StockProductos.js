const { Schema, model } = require('mongoose');


const stockProductosSchema = new Schema({
    sucursal: {
        type: Schema.Types.ObjectId,
        ref: 'Sucursales',
        required: true
    },
    producto: {
        type: Schema.Types.ObjectId,
        ref: 'Productos',
        required: true
    },
    existencia: {
        type: Schema.Types.Decimal128,
        required: true
    },
    precio: {
        type: Number,
        required: true
    },
    creador: {
        type: Schema.Types.ObjectId,
        ref: 'Usuarios',
        required: true
    },
    fechaCreacion: {
        type: Number,
        required: true
    },
    ultimoEnModificar: {
        type: Schema.Types.ObjectId,
        ref: 'Usuarios',
        required: true
    },
    fechaUltimaModificacion: {
        type: Number,
        required: true
    }
});

stockProductosSchema.method('toJSON', function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    object.existencia = parseFloat(object.existencia);
    return object;
});

module.exports.StockProductos = model('StockProductos', stockProductosSchema);
