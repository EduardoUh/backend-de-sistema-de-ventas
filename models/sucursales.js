const { Schema, model } = require('mongoose');


const sucursalSchema = new Schema({
    nombre: {
        type: String,
        required: true,
        trim: true,
        uppercase: true
    },
    ciudad: {
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
    email: {
        type: String,
        required: true,
        trim: true
    },
    activa: {
        type: Boolean,
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

sucursalSchema.method('toJSON', function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
});

module.exports.Sucursal = model('Sucursales', sucursalSchema);
