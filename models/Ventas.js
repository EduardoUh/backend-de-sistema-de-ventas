const { Schema, model } = require('mongoose');


const ventaSchema = new Schema({
    sucursal: {
        type: Schema.Types.ObjectId,
        ref: 'Sucursales',
        required: true
    },
    creador: {
        type: Schema.Types.ObjectId,
        ref: 'Usuarios',
        required: true
    },
    cliente: {
        type: Schema.Types.ObjectId,
        ref: 'Clientes',
        default: null
    },
    articulos: [{
        producto: {
            type: Schema.Types.ObjectId,
            ref: 'Productos',
            required: true
        },
        cantidad: {
            type: Number,
            required: true
        }
    }],
    total: {
        type: Number,
        required: true
    },
    pagoCon: {
        type: Number,
        required: true
    },
    pago: {
        type: Number,
        required: true
    },
    cambio: {
        type: Number,
        required: true
    },
    saldo: {
        type: Schema.Types.Decimal128,
        required: true
    },
    saldada: {
        type: Boolean,
        required: true
    },
    fechaCreacion: {
        type: Number,
        required: true
    }
});

ventaSchema.method('toJSON', function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    object.saldo = parseFloat(object.saldo);
    return object;
});

module.exports.Venta = model('Ventas', ventaSchema);
