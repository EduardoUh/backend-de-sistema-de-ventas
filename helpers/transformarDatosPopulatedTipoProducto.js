module.exports.transformarDatosPopulatedTipoProducto = (documento) => {
    const { __v, _id, descripcion, activo, creador, fechaCreacion, ultimoEnModificar, fechaUltimaModificacion, ...object } = documento.toObject();

    object.id = _id;

    return object;
}