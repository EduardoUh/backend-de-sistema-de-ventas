module.exports.transformarDatosPopulatedProducto = (documento) => {
    const { __v, _id, tipoProducto, proveedor, creador, fechaCreacion, ultimoEnModificar, fechaUltimaModificacion, ...object } = documento.toObject();

    object.id = _id;

    return object;
}