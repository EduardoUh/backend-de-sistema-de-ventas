module.exports.transformarDatosPopulatedSucursal = (documento) => {
    const { __v, _id, ciudad, direccion, email, creador, ...object } = documento.toObject();

    object.id = _id;

    return object;
}