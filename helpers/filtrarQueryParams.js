module.exports.filtrarQueryParams = (queryParams = {}, desiredParams = []) => {
    if (Object.keys(queryParams).length === 0 || desiredParams.length === 0) {
        return {};
    }

    const params = {};

    desiredParams.forEach(desiredParam => {
        if (queryParams[desiredParam]) {
            params[desiredParam] = queryParams[desiredParam];
        }
    });

    return params;
}
