"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var TigerServer_1 = require("./TigerServer");
function tiger(fn) {
    var tiger = new TigerServer_1.default();
    if (fn)
        fn(tiger);
    return tiger;
}
exports.tiger = tiger;
