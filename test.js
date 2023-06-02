const R6 = require('./index.js');

let platform = 'psn';
let name = 'James_moreno';

async function main() {
    let rank = await R6.casual(platform, name);
    console.log(rank);
}

main();
