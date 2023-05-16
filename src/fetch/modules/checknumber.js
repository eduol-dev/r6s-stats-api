module.exports = function (parameter) {
    const regex = new RegExp(/\d/);
    return regex.test(parameter) ? Number(parameter) : 0;
}