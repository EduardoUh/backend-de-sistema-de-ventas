module.exports.transformarDatosPopulatedUsuario = (documento) => {
    const { __v, _id, rfc, sucursal, password, direccion, modulos, creador, fechaCreacion, ultimoEnModificar, fechaUltimaModificacion, ...object } = documento.toObject();

    object.id = _id;

    return object;
}