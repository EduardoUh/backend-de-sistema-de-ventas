module.exports.transformarDatosPopulatedUsuario = (documento) => {
    const { __v, _id, rfc, sucursal, password, direccion, ...object } = documento.toObject();

    object.id = _id;

    return object;
}