const { Schema, model } = require('mongoose');


const compraSchema = new Schema({
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
    proveedor: {
        type: Schema.Types.ObjectId,
        ref: 'Proveedores',
        required: true
    },
    articulos: [{
        producto: {
            type: Schema.Types.ObjectId,
            ref: 'Productos',
            required: true
        },
        precioCompra: {
            type: Number,
            required: true
        },
        precioVenta: {
            type: Number,
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
    fechaCreacion: {
        type: Number,
        required: true
    }
});

compraSchema.method('toJSON', function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
});

module.exports.Compra = model('Compras', compraSchema);
