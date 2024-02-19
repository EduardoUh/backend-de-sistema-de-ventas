const { Schema, model } = require('mongoose');


const proveedoresSchema = new Schema({
    nombre: {
        type: String,
        required: true,
        trim: true,
        uppercase: true
    },
    direccion: {
        type: String,
        required: true,
        trim: true,
        uppercase: true
    },
    numTelefono: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    rfc: {
        type: String,
        required: true,
        trim: true,
        unique: true
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

proveedoresSchema.method('toJSON', function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
});

module.exports.Proveedor = model('Proveedores', proveedoresSchema);
