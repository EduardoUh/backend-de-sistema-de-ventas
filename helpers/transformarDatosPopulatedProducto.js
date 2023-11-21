module.exports.transformarDatosPopulatedProducto = (documento) => {
    const { __v, _id, tipoProducto, proveedor, ...object } = documento.toObject();

    object.id = _id;

    return object;
}