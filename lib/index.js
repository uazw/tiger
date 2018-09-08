"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var TigerServer_1 = require("./TigerServer");
function tiger(basePath, fn) {
    var tiger = new TigerServer_1.default(basePath);
    if (fn)
        fn(tiger);
    return tiger;
}
exports.tiger = tiger;
