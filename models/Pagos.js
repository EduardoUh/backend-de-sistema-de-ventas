const { Schema, model } = require('mongoose');


const pagoSchema = new Schema({
    venta: {
        type: Schema.Types.ObjectId,
        ref: 'Ventas',
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
    pagoCon: {
        type: Number,
        required: true
    },
    cantidad: {
        type: Number,
        required: true
    },
    cambio: {
        type: Number,
        required: true
    },
    saldo: {
        type: Number,
        required: true
    }
});

pagoSchema.method('toJSON', function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
});

module.exports.Pago = model('Pagos', pagoSchema);
