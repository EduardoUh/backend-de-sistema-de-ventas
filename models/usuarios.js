const { Schema, model } = require('mongoose');


const usuarioSchema = new Schema({
    nombres: {
        type: String,
        required: true,
        trim: true,
        uppercase: true
    },
    apellidoPaterno: {
        type: String,
        required: true,
        trim: true,
        uppercase: true
    },
    apellidoMaterno: {
        type: String,
        required: true,
        trim: true,
        uppercase: true
    },
    rfc: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    rol: {
        type: Schema.Types.ObjectId,
        ref: 'Roles',
        required: true
    },
    sucursal: {
        type: Schema.Types.ObjectId,
        ref: 'Sucursales',
        default: null
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        trim: true
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
        trim: true
    },
    activo: {
        type: Boolean,
        required: true,
        default: true
    },
    creador: {
        type: Schema.Types.ObjectId,
        ref: 'Usuarios'
    },
    fechaCreacion: {
        type: Number,
        required: true
    },
    ultimoEnModificar: {
        type: Schema.Types.ObjectId,
        ref: 'Usuarios'
    },
    fechaUltimaModificacion: {
        type: Number,
        required: true
    }
});

usuarioSchema.method('toJSON', function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
});

module.exports.Usuario = model('Usuarios', usuarioSchema);
