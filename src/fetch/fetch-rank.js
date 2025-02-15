const cheerio = require('cheerio');
const exec = require('./modules/exec-fetch');
const filterArray = require('./modules/filterarray');


module.exports = async function (url) {
    let result = [];
    let rank = [];
    let profile = [];

    const data = await exec(url);

    if (!data) {
        result[0] = 'timeout';
        return result;
    }

    const $ = cheerio.load(data.body);

    $('#profile .r6-season').each(function (i, elem) {
        rank.push(filterArray($(this).text().split('\n')));
    });

    $('#profile .trn-card').each(function (i, elem) {
        profile.push(filterArray($(this).text().split('\n')));
    });

    let imgurl = $('img').map(function () {
        return $(this).attr('src');
    });
    let header = imgurl.toArray()[0];
    result.push(header);

    if (header.indexOf('avatars') === -1 && header.indexOf('xbox') === -1) {
        result[0] = 'error';
        return result;
    }

    for (var i = 0; i < rank.length; i++) {
        if (rank[i].indexOf('Ranked') !== -1) {
            result.push(rank[i]);
            break;
        }
    }

    return result;
};