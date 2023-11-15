const { Schema, model } = require('mongoose');


const productoModel = new Schema({
    nombre: {
        type: String,
        required: true,
        trim: true,
        uppercase: true
    },
    descripcion: {
        type: String,
        required: true,
        trim: true,
        uppercase: true
    },
    tipoProducto: {
        type: Schema.Types.ObjectId,
        ref: 'TiposProductos',
        required: true
    },
    proveedor: {
        type: Schema.Types.ObjectId,
        ref: 'Proveedores',
        required: true
    },
    precio: {
        type: Number,
        required: true
    },
    activo: {
        type: Boolean,
        default: true
    }
});

productoModel.method('toJSON', function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
});

module.exports.Producto = model('Productos', productoModel);
