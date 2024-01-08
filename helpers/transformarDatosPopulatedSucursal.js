module.exports.transformarDatosPopulatedSucursal = (documento) => {
    const { __v, _id, ciudad, direccion, email, creador, fechaCreacion, ultimoEnModificar, fechaUltimaModificacion, ...object } = documento.toObject();

    object.id = _id;

    return object;
}