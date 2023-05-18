module.exports = function (parameter) {
    const regex = new RegExp(/\d/);
    if (typeof parameter == "string")
        parameter = parameter.replace(',', '')
    return regex.test(parameter) ? Number(parameter) : 0;
}