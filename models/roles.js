const { Schema, model } = require('mongoose');


const rolSchema = new Schema({
    rol: {
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
    }
});

rolSchema.method('toJSON', function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
});

module.exports.Rol = model('Roles', rolSchema);
