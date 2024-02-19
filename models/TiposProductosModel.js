const { Schema, model } = require('mongoose');


const tiposProductosSchema = new Schema({
    tipoProducto: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    descripcion: {
        type: String,
        required: true,
        trim: true
    },
    activo: {
        type: Boolean,
        default: true
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

tiposProductosSchema.method('toJSON', function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
});

module.exports.TipoProducto = model('TiposProductos', tiposProductosSchema);
