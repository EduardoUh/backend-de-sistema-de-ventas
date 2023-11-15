module.exports.transformarDatosPopulatedProveedor = (documento) => {
    const { __v, _id, direccion, numTelefono, email, rfc, activo, ...object } = documento.toObject();

    object.id = _id;

    return object;
}