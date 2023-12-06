module.exports.transformarDatosPopulatedProveedor = (documento) => {
    const { __v, _id, direccion, numTelefono, email, rfc, activo, creador, fechaCreacion, ultimoEnModificar, fechaUltimaModificacion, ...object } = documento.toObject();

    object.id = _id;

    return object;
}