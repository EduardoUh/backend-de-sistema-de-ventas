module.exports.transformarDatosPopulatedSucursal = (documento) => {
    const { nombre } = documento.toObject();

    return nombre;
}