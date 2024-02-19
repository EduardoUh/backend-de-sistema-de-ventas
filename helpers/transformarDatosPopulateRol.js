module.exports.transformarDatosPopulateRol = (documento) => {
    const { rol, _id } = documento.toObject();

    return {rol, id: _id};
}