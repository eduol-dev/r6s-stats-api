const cheerio = require('cheerio');
const exec = require('./modules/exec-fetch');
const filterArray = require('./modules/filterarray');

module.exports = async function (url) {
    let result = [];
    const data = await exec(url);
    if (!data) {
        result[0] = 'timeout';
        return result;
    }
    const $ = cheerio.load(data.body);
    var scripts = $('script').filter(function () {
        return ($(this).html().indexOf('var imp_matches') > -1);
    });
    if (scripts.length == 1) {
        var text = $(scripts[0]).html();
        jsonObj = JSON.parse(text.replace('var imp_matches = ', '').replace(';', ''))
        result[0] = jsonObj;
    }
    return result;
};