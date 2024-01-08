const { Schema, model } = require('mongoose');


const moduloSchema = new Schema({
    nombre: {
        type: String,
        uppercase: true,
        trim: true,
        required: true
    },
    componente: {
        type: String,
        trim: true,
        required: true
    },
    ruta: {
        type: String,
        lowercase: true,
        trim: true,
        required: true
    },
    permisos: [{
        type: String,
        uppercase: true,
        trim: true,
        required: true
    }]
});

moduloSchema.method('toJSON', function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
});

module.exports.Modulo = model('Modulos', moduloSchema);
