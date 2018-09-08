

let { tiger } = require ("../lib/index")

let tg = tiger();

tg.serve(`${__dirname}/modules`);