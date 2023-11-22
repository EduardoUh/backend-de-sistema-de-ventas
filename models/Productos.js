const { Schema, model } = require('mongoose');


const productoSchema = new Schema({
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
        default: null
    },
    precio: {
        type: Number,
        required: true
    },
    ventaPor: {
        type: String,
        required: true,
        trim: true,
        uppercase: true,
        enum: {
            values: ['KILOGRAMO', 'PIEZA'],
            messga: 'El valor {VALUE} no es soportado'
        }
    },
    activo: {
        type: Boolean,
        default: true
    }
});

productoSchema.method('toJSON', function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
});

module.exports.Producto = model('Productos', productoSchema);
