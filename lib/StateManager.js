"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var STATE = {};
// todo: Replace with PouchDB
exports.default = (function (key, value) {
    if (value) {
        STATE[key] = value;
    }
    return STATE[key] || {};
});
