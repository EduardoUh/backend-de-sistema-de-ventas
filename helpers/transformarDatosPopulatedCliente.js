module.exports.transformarDatosPopulatedCliente = (documento) => {
    const { _id, __v, creador, fechaCreacion, ultimoEnModificar, fechaUltimaModificacion, ...object } = documento.toObject();

    object.id = _id;

    return object;
}