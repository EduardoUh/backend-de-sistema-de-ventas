module.exports.transformarDatosPopulatedTipoProducto = (documento) => {
    const { __v, _id, descripcion, activo, ...object } = documento.toObject();

    object.id = _id;

    return object;
}