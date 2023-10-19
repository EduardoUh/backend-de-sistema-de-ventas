module.exports.transformarDatosPopulateRol = (documento) => {
    const { rol } = documento.toObject();
    return rol;
}